import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
} from '@overnightjs/core';
import { Request, Response } from 'express';
import { ensureAuthenticated } from '@src/middlewares/ensureAuthenticated';
import { Chat } from '@src/models/Chat';
import { BaseController } from '.';

@Controller('messages')
@ClassMiddleware(ensureAuthenticated)
export class UserMessageController extends BaseController {
  @Get('latest-messages/:id')
  @Middleware(ensureAuthenticated)
  public async index(request: Request, response: Response): Promise<Response> {
    try {
      const user = request.user.id;
      const userReceivingId = request.params.id;

      const latestMessages = await Chat.findOne({
        users: [user, userReceivingId],
      })
        .populate({
          path: 'messages',
        })
        .limit(20);

      return response.json({
        latestMessages: latestMessages?.messages,
      });
    } catch (error) {
      console.log(error);
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }
}
