import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
} from '@overnightjs/core';
import { Request, Response } from 'express';
import { ensureAuthenticated } from '@src/middlewares/ensureAuthenticated';
import { Message } from '@src/models/Message';
import { BaseController } from '.';

@Controller('messages')
@ClassMiddleware(ensureAuthenticated)
export class UserMessageController extends BaseController {
  @Get('latestMessages/:id')
  @Middleware(ensureAuthenticated)
  public async index(request: Request, response: Response): Promise<Response> {
    try {
      const user = request.user.id;
      const chatId = request.params.id;

      const latestMessages = await Message.find({
        chatId,
        user,
      }).limit(20);

      return response.json({ latestMessages });
    } catch (error) {
      console.log(error);
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }
}
