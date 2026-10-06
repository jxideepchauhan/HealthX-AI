import { Router } from 'express';
import { prisma } from '@healthx/database';
import { authMiddleware } from '../middleware/auth';
import { MockABDMProvider, OfficialABDMProvider, ABDMProvider } from '../providers/abdm';
import { AppError } from '@healthx/shared';

export const abdmRouter = Router();

const abdmProvider: ABDMProvider = process.env.ABDM_CLIENT_ID
  ? new OfficialABDMProvider()
  : new MockABDMProvider();

abdmRouter.use(authMiddleware);

// GET /api/v1/abdm/status
abdmRouter.get('/status', async (req, res, next) => {
  try {
    const conn = await prisma.aBHAConnection.findUnique({
      where: { userId: req.user!.userId },
    });

    res.json({
      status: conn?.status || 'NOT_CONNECTED',
      abhaAddress: conn?.abhaAddress || null,
      abhaNumber: conn?.abhaNumber || null,
      linkedAt: conn?.linkedAt || null,
      isOfficialGatewayConfigured: Boolean(process.env.ABDM_CLIENT_ID),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/abdm/connect
abdmRouter.post('/connect', async (req, res, next) => {
  try {
    const { abhaAddress } = req.body;
    if (!abhaAddress) {
      throw new AppError('VALIDATION_ERROR', 'ABHA address is required (e.g. user@abdm or user@sbx)');
    }

    const initResult = await abdmProvider.initiateConnection(req.user!.userId, abhaAddress);

    const connection = await prisma.aBHAConnection.upsert({
      where: { userId: req.user!.userId },
      update: {
        status: initResult.status,
        abhaAddress,
        linkedAt: initResult.status === 'CONNECTED' ? new Date() : null,
      },
      create: {
        userId: req.user!.userId,
        status: initResult.status,
        abhaAddress,
        linkedAt: initResult.status === 'CONNECTED' ? new Date() : null,
      },
    });

    res.json({
      message: 'ABDM connection initiated. Please approve the consent request on your ABHA mobile app.',
      transactionId: initResult.transactionId,
      status: connection.status,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/abdm/consent
abdmRouter.post('/consent', async (req, res, next) => {
  try {
    const { abhaAddress, purpose } = req.body;

    const consentReq = await abdmProvider.requestConsent({
      patientAbhaId: abhaAddress,
      hiTypes: ['DiagnosticReport', 'Prescription', 'OPConsultation'],
      purpose: purpose || 'Health record aggregation',
      dateRange: { from: '2020-01-01', to: '2026-10-06' },
      expiryDate: '2027-10-06',
    });

    res.json({
      consentRequestId: consentReq.consentRequestId,
      status: consentReq.status,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/abdm/records
abdmRouter.get('/records', async (req, res, next) => {
  try {
    const conn = await prisma.aBHAConnection.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!conn || conn.status !== 'CONNECTED') {
      res.json({
        status: conn?.status || 'NOT_CONNECTED',
        records: [],
        message: 'ABHA is not actively connected. Please connect ABHA to discover health records.',
      });
      return;
    }

    const discovery = await abdmProvider.discoverRecords(conn.abhaAddress || '');
    res.json({
      status: conn.status,
      records: discovery.matchedRecords,
    });
  } catch (err) {
    next(err);
  }
});
