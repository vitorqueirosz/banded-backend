import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
  Post,
} from '@overnightjs/core';
import { Request, Response } from 'express';
import CreateUserAlbumsService from '@src/services/CreateUserAlbumsService';
import { ensureAuthenticated } from '@src/middlewares/ensureAuthenticated';
import UserAlbumsService from '@src/services/UserAlbumsService';
import { BaseController } from '.';

@Controller('userAlbums')
@ClassMiddleware(ensureAuthenticated)
export class UserAlbumsController extends BaseController {
  @Post('')
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { albums } = request.body;

      const user_id = request.user.id;

      const createUserAlbumsService = new CreateUserAlbumsService();

      const userMusics = await createUserAlbumsService.execute({
        user_id,
        albums,
      });

      return response.status(201).json(userMusics);
    } catch (error) {
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }

  @Get('')
  @Middleware(ensureAuthenticated)
  public async find(request: Request, response: Response): Promise<Response> {
    try {
      const user_id = request.user.id;
      const { pageSize, page } = request.query;

      const userAlbumsService = new UserAlbumsService();

      const userBands = await userAlbumsService.execute({
        user_id: String(user_id || ''),
        pageSize: Number(pageSize),
        page: Number(page),
      });

      return response.json(userBands);
    } catch (error) {
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }
}
