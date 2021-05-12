import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
} from '@overnightjs/core';
import { Request, Response } from 'express';
import { ensureAuthenticated } from '@src/middlewares/ensureAuthenticated';
import { Chat, ChatModel } from '@src/models/Chat';
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

      const latestMessages: ChatModel = await Chat.findOne({
        users: {
          $in: [user, userReceivingId],
        },
      })
        .populate({ path: 'messages' })
        .limit(20);

      const formatedLatestMessages = latestMessages?.messages.map(
        ({ _id, createdAt, text, userReceivingId, user }) => ({
          user,
          messageId: _id,
          userReceivingId,
          text,
          createdAt,
        }),
      );

      return response.json({
        latestMessages: formatedLatestMessages,
      });
    } catch (error) {
      console.log(error);
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }
}
