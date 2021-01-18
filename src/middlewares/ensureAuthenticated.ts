import AuthService from '@src/services/authService';
import { NextFunction, Request, Response } from 'express';

export interface DecodedToken {
  iat: string;
  exp: string;
  sub: string;
}

export function ensureAuthenticated(
  request: Partial<Request>,
  response: Partial<Response>,
  next: NextFunction,
): void | Response {
  const token = request.headers?.['x-access-token'];

  try {
    const decoded = AuthService.decodeToken(token as string);

    const { sub } = decoded as DecodedToken;

    request.user = {
      id: sub,
    };

    return next();
  } catch (error) {
    return response.status?.(401).json({ code: 401, error: error.message });
  }
}
