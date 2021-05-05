/* eslint-disable no-shadow */
import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
} from '@overnightjs/core';
import { Request, Response } from 'express';
import { ensureAuthenticated } from '@src/middlewares/ensureAuthenticated';
import { User, UserModel } from '@src/models/User';
import { Chat, ChatModel } from '@src/models/Chat';
import { BaseController } from '.';

@Controller('chats')
@ClassMiddleware(ensureAuthenticated)
export class UserChatsController extends BaseController {
  @Get('search')
  @Middleware(ensureAuthenticated)
  public async index(request: Request, response: Response): Promise<Response> {
    try {
      const { name } = request.query;
      const userLoggedId = request.user.id;

      let users: UserModel[] = [];

      if (!name) return response.json([]);

      users = await User.find({
        name: new RegExp(String(name)),
      });

      const checkHasSameUser = users.findIndex(
        user => user.id === userLoggedId,
      );

      if (checkHasSameUser !== -1) {
        users.splice(checkHasSameUser, 1);
      }

      return response.json(users);
    } catch (error) {
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }

  @Get('')
  @Middleware(ensureAuthenticated)
  public async search(request: Request, response: Response): Promise<Response> {
    try {
      const userLoggedId = request.user.id;

      const userChats = await Chat.find({
        users: {
          $in: [userLoggedId],
        },
      })
        .populate([
          { path: 'users' },
          {
            path: 'messages',
            // populate: {
            //   path: 'users',
            //   model: 'users',
            // },
          },
        ])
        .limit(15);

      userChats.forEach((user: any) => {
        const checkUserLoggedIn = user.users.findIndex(
          (user: any) => user.id === userLoggedId,
        );

        user.users.splice(checkUserLoggedIn, 1);
      });

      const formattedUserChats = userChats.map(({ users, messages }: any) => {
        const user = [users];
        const lastMessage = messages[messages.length - 1];

        return {
          ...users,
          lastMessage: {
            lastMessage,
            isReceived: lastMessage.userReceivingId === userLoggedId,
          },
        };
      });

      return response.json(formattedUserChats);
    } catch (error) {
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }
}
