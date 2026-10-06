import type { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '@healthx/security';
import { AppError } from '@healthx/shared';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      requestId?: string;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.healthx_token) {
      token = req.cookies.healthx_token;
    }

    if (!token) {
      throw new AppError('UNAUTHORIZED', 'Authentication credentials were not provided', 401);
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
}
