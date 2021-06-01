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
  chatId: string;
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

      const usersOnChat: UserChat[] = [];

      const [userChats] = await Promise.all(
        checkedUserChats.map(async user => {
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

          if (userChat && userChat.messages.length) {
            const filteredUserChat = checkIsTheSameUser(
              userChat.users,
              userLoggedId,
            );

            const formattedUserChat = {
              users: filteredUserChat,
              chatId: userChat.id,
              messages: userChat.messages,
            };

            usersOnChat.push((formattedUserChat as unknown) as UserChat);
          } else if (name) {
            usersOnChat.push((user as unknown) as UserChat);
          }

          return usersOnChat;
        }),
      );

      const formattedUserChatsList = formattedUserChats(
        userChats,
        userLoggedId,
      );

      return response.json({ chats: formattedUserChatsList ?? [] });
    } catch (error) {
      console.log(error);
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }
}
