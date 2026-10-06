import { Router } from 'express';
import { prisma } from '@healthx/database';
import { authMiddleware } from '../middleware/auth';
import { AssistantChatSchema, AppError } from '@healthx/shared';
import { LocalLLMProvider, RAGRetriever, GroundedContextChunk } from '@healthx/ai';

export const assistantRouter = Router();

const llmProvider = new LocalLLMProvider();

assistantRouter.use(authMiddleware);

// POST /api/v1/assistant/chat
assistantRouter.post('/chat', async (req, res, next) => {
  try {
    const { conversationId, message, language, detailLevel } = AssistantChatSchema.parse(req.body);
    const userId = req.user!.userId;

    // 1. Get or create conversation
    let conv = null;
    if (conversationId) {
      conv = await prisma.conversation.findFirst({
        where: { id: conversationId, userId },
      });
    }

    if (!conv) {
      conv = await prisma.conversation.create({
        data: {
          userId,
          title: message.slice(0, 40) + '...',
        },
      });
    }

    // 2. Fetch authorized context chunks belonging ONLY to this user (Strict multi-tenancy filter)
    const storedEmbeddings = await prisma.embedding.findMany({
      where: { userId },
      include: { document: { select: { title: true, fileType: true, createdAt: true } } },
    });

    let contextChunks: GroundedContextChunk[] = storedEmbeddings.map((emb) => ({
      id: emb.chunkId,
      userId: emb.userId,
      documentId: emb.documentId,
      documentTitle: emb.document?.title || 'Medical Document',
      documentType: emb.document?.fileType || 'LAB_REPORT',
      page: 1,
      date: emb.document?.createdAt.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      text: emb.chunkText,
    }));

    if (contextChunks.length === 0) {
      const userDocs = await prisma.document.findMany({
        where: { userId },
        include: { pages: true, ocrResult: true },
      });
      for (const d of userDocs) {
        const text = d.ocrResult?.fullText || d.pages?.[0]?.textContent || '';
        if (text) {
          contextChunks.push({
            id: `${d.id}-chunk-0`,
            userId: d.userId,
            documentId: d.id,
            documentTitle: d.title,
            documentType: d.fileType,
            page: 1,
            date: d.createdAt.toISOString().split('T')[0],
            text,
          });
        }
      }
    }

    // 3. RAG Retrieval with multi-tenancy filter
    const retrievedChunks = RAGRetriever.retrieveAuthorizedChunks(message, userId, contextChunks);
    const effectiveChunks = retrievedChunks.length > 0 ? retrievedChunks : contextChunks.slice(0, 5);

    // 4. LLM Generation with Clinical Grounding and Safety Checks
    const aiResult = await llmProvider.chat(message, effectiveChunks, { language, detailLevel });

    // 5. Store user message
    await prisma.message.create({
      data: {
        conversationId: conv.id,
        role: 'user',
        content: message,
      },
    });

    // 6. Store assistant message with citations
    const assistantMsg = await prisma.message.create({
      data: {
        conversationId: conv.id,
        role: 'assistant',
        content: aiResult.answer,
        confidence: aiResult.confidence,
        safetyFlagsJson: JSON.stringify(aiResult.safetyFlags),
        citations: {
          create: aiResult.citations.map((c) => ({
            documentId: c.documentId || 'doc-general',
            documentTitle: c.documentTitle || 'Medical Record',
            page: Number(c.page) || 1,
            field: c.field || null,
            date: c.date || null,
            excerpt: c.excerpt || '',
          })),
        },
      },
      include: { citations: true },
    });

    const usedRecords = retrievedChunks.map((c) => ({
      id: c.documentId,
      type: c.documentType,
      title: c.documentTitle,
    }));

    res.json({
      conversation_id: conv.id,
      message_id: assistantMsg.id,
      answer: aiResult.answer,
      citations: aiResult.citations,
      confidence: aiResult.confidence,
      used_records: usedRecords,
      safety_flags: aiResult.safetyFlags,
      language,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/assistant/conversations
assistantRouter.get('/conversations', async (req, res, next) => {
  try {
    const convs = await prisma.conversation.findMany({
      where: { userId: req.user!.userId },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ conversations: convs });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/assistant/conversations/:id
assistantRouter.get('/conversations/:id', async (req, res, next) => {
  try {
    const conv = await prisma.conversation.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
      include: {
        messages: {
          include: { citations: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conv) {
      throw new AppError('NOT_FOUND', 'Conversation not found', 404);
    }

    res.json({ conversation: conv });
  } catch (err) {
    next(err);
  }
});
