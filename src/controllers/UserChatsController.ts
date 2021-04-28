import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
} from '@overnightjs/core';
import { Request, Response } from 'express';
import { ensureAuthenticated } from '@src/middlewares/ensureAuthenticated';
import { User } from '@src/models/User';
import { BaseController } from '.';

@Controller('userChats')
@ClassMiddleware(ensureAuthenticated)
export class UserChatsController extends BaseController {
  @Get('')
  @Middleware(ensureAuthenticated)
  public async index(request: Request, response: Response): Promise<Response> {
    try {
      const { name } = request.query;

      if (!name) return response.json([]);

      const users = await User.find({
        name: new RegExp(String(name)),
      });

      return response.json(users);
    } catch (error) {
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }
}
