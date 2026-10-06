import type { Request, Response, NextFunction } from 'express';
import { formatErrorResponse, AppError } from '@healthx/shared';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = req.requestId || (req.headers['x-request-id'] as string) || 'req-unknown';
  const formatted = formatErrorResponse(err, requestId);
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  res.status(statusCode).json(formatted);
}
