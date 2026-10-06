import { Router } from 'express';
import multer from 'multer';
import { prisma } from '@healthx/database';
import { authMiddleware } from '../middleware/auth';
import {
  AppError,
  SUPPORTED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  VerifyDocumentEntitySchema,
} from '@healthx/shared';
import { sanitizeFileName, computeFileHash, createAuditLog } from '@healthx/security';
import { LocalStorageProvider } from '../providers/storage';
import { ProcessingQueue } from '../queue/processingQueue';

export const documentsRouter = Router();

const upload = multer({
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!SUPPORTED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new AppError('UNSUPPORTED_FILE_TYPE', `Unsupported file type: ${file.mimetype}`));
    }
    cb(null, true);
  },
});

const storageProvider = new LocalStorageProvider();
const processingQueue = ProcessingQueue.getInstance();

documentsRouter.use(authMiddleware);

// POST /api/v1/documents (Upload Medical Document)
documentsRouter.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const file = req.file;
    const title = req.body.title || (file ? file.originalname : 'Medical Document');

    if (!file && !req.body.textPayload) {
      throw new AppError('VALIDATION_ERROR', 'File or document textPayload is required.');
    }

    const fileBuffer = file ? file.buffer : Buffer.from(req.body.textPayload || '');
    const mimeType = file ? file.mimetype : 'application/pdf';
    const originalName = file ? file.originalname : `${title.replace(/\s+/g, '_')}.pdf`;
    const safeName = sanitizeFileName(originalName);

    // 1. Hash generation & Duplicate Detection (Section 12, Requirement 19)
    const fileHash = computeFileHash(fileBuffer);

    const existingDoc = await prisma.document.findFirst({
      where: {
        userId: req.user!.userId,
        fileHash,
      },
    });

    // 2. Secure Object Storage
    const storageKey = `users/${req.user!.userId}/docs/${Date.now()}_${safeName}`;
    await storageProvider.uploadFile(storageKey, fileBuffer, mimeType);

    // 3. Create Document Record
    const doc = await prisma.document.create({
      data: {
        userId: req.user!.userId,
        title,
        fileName: safeName,
        fileType: safeName.split('.').pop()?.toUpperCase() || 'PDF',
        mimeType,
        fileSize: fileBuffer.length,
        storageKey,
        fileHash,
        processingStatus: 'QUEUED',
        duplicateOfId: existingDoc ? existingDoc.id : null,
      },
    });

    // 4. Enqueue background processing job
    const jobId = await processingQueue.enqueue(doc.id);

    // 5. Audit Event
    const audit = createAuditLog(req.user!.userId, req.user!.role, 'CREATE', 'Document', doc.id, 'SUCCESS');
    await prisma.auditEvent.create({
      data: {
        userId: req.user!.userId,
        userRole: req.user!.role,
        action: audit.action,
        resource: audit.resource,
        resourceId: audit.resourceId,
        result: audit.result,
        hash: audit.hash,
        previousHash: audit.previousHash,
        timestamp: audit.timestamp,
      },
    });

    res.status(201).json({
      document_id: doc.id,
      title: doc.title,
      status: doc.processingStatus,
      processing_status: doc.processingStatus,
      is_duplicate: Boolean(existingDoc),
      duplicate_of_id: doc.duplicateOfId,
      job_id: jobId,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/documents (List user documents)
documentsRouter.get('/', async (req, res, next) => {
  try {
    const documents = await prisma.document.findMany({
      where: { userId: req.user!.userId },
      include: {
        ocrResult: { select: { confidence: true, isHandwritten: true, handwritingConfidence: true } },
        extractedEntities: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ documents });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/documents/:id (Get single document with pages & OCR)
documentsRouter.get('/:id', async (req, res, next) => {
  try {
    const doc = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId, // Strict multi-tenancy filter
      },
      include: {
        pages: true,
        ocrResult: true,
        extractedEntities: true,
        labResults: true,
        medications: true,
      },
    });

    if (!doc) {
      throw new AppError('DOCUMENT_NOT_FOUND', 'The requested document could not be found.', 404);
    }

    res.json({ document: doc });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/documents/:id/process (Trigger re-processing)
documentsRouter.post('/:id/process', async (req, res, next) => {
  try {
    const doc = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });

    if (!doc) {
      throw new AppError('DOCUMENT_NOT_FOUND', 'The requested document could not be found.', 404);
    }

    const jobId = await processingQueue.enqueue(doc.id);
    res.json({ message: 'Document processing enqueued', jobId });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/documents/:id/status (Check processing status)
documentsRouter.get('/:id/status', async (req, res, next) => {
  try {
    const doc = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
      select: { id: true, processingStatus: true, title: true, updatedAt: true },
    });

    if (!doc) {
      throw new AppError('DOCUMENT_NOT_FOUND', 'Document not found.', 404);
    }

    const latestJob = await prisma.processingJob.findFirst({
      where: { documentId: doc.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      documentId: doc.id,
      status: doc.processingStatus,
      stage: latestJob?.stage || 'COMPLETED',
      attempts: latestJob?.attempts || 1,
      errorMessage: latestJob?.errorMessage || null,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/documents/:id/verify (Verify extracted fields per Requirement 15, 68)
documentsRouter.post('/:id/verify', async (req, res, next) => {
  try {
    const { entityId, correctedValue, verificationStatus } = VerifyDocumentEntitySchema.parse(req.body);

    const doc = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });

    if (!doc) {
      throw new AppError('DOCUMENT_NOT_FOUND', 'Document not found.', 404);
    }

    const updatedEntity = await prisma.extractedEntity.update({
      where: { id: entityId },
      data: {
        verificationStatus,
        ...(correctedValue ? { value: correctedValue, normalizedValue: correctedValue } : {}),
      },
    });

    res.json({
      message: 'Field verified and updated.',
      entity: updatedEntity,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/documents/:id
documentsRouter.delete('/:id', async (req, res, next) => {
  try {
    const doc = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });

    if (!doc) {
      throw new AppError('DOCUMENT_NOT_FOUND', 'Document not found.', 404);
    }

    await prisma.document.delete({
      where: { id: doc.id },
    });

    res.json({ message: 'Document successfully deleted.' });
  } catch (err) {
    next(err);
  }
});
