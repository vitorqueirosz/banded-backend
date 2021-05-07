import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
} from '@overnightjs/core';
import { Request, Response } from 'express';
import { ensureAuthenticated } from '@src/middlewares/ensureAuthenticated';
import { User, UserModel } from '@src/models/User';
import { MessageModel } from '@src/models/Message';
import { Chat } from '@src/models/Chat';
import { checkIsTheSameUser } from '@src/utils/checkIsTheSameUser';
import { formattedUserChats } from '@src/utils/formatUserChatsResponse';
import { BaseController } from '.';

export type UserChat = {
  users: UserModel[];
  messages: MessageModel[];
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

@Controller('chats')
@ClassMiddleware(ensureAuthenticated)
export class UserChatsController extends BaseController {
  @Get('')
  @Middleware(ensureAuthenticated)
  public async index(request: Request, response: Response): Promise<Response> {
    try {
      const { name } = request.query;
      const userLoggedId = request.user.id;

      const userChatsId = await User.find({
        name: new RegExp(String(name)),
      });

      const checkedUserChats = checkIsTheSameUser(userChatsId, userLoggedId);

      const [userChats] = await Promise.all(
        checkedUserChats.map(async user => {
          const usersOnChat: UserChat[] = [];

          const userChat = await Chat.findOne({
            users: {
              $in: [user.id],
            },
          }).populate([
            { path: 'users' },
            {
              path: 'messages',
            },
          ]);

          usersOnChat.push(userChat);
          return usersOnChat;
        }),
      );

      const formattedUserChatsList = formattedUserChats(
        userChats,
        userLoggedId,
      );

      return response.json(formattedUserChatsList);
    } catch (error) {
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }
}
