import { CUSTOM_VALIDATION } from '@src/models/User';
import AppError from '@src/utils/errors/appError';
import { Request, Response } from 'express';

import mongoose from 'mongoose';

export abstract class BaseController {
  protected sendCreatedUpdateErrorResponse(
    response: Response,
    request: Request,
    err: mongoose.Error.ValidationError | Error,
  ): Response {
    if (err instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientErrors(err);

      return response
        .status(clientErrors.code)
        .json({ code: clientErrors.code, error: clientErrors.error });
    }

    if (err instanceof AppError) {
      return response
        .status(err.code)
        .json({ code: err.code, error: err.message });
    }

    return response
      .status(500)
      .json({ code: 500, error: 'Something went wrong' });
  }

  private handleClientErrors(
    err: mongoose.Error.ValidationError,
  ): { code: number; error: string } {
    const duplicatedKindErrors = Object.values(err.errors).filter(
      error => error.kind === CUSTOM_VALIDATION.DUPLICATED,
    );

    if (duplicatedKindErrors.length) {
      return { code: 409, error: err.message };
    }

    return { code: 400, error: err.message };
  }
}
