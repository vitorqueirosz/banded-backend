import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
  Post,
} from '@overnightjs/core';
import { Request, Response } from 'express';
import CreateUserMusicsService from '@src/services/CreateUserMusicsService';
import { ensureAuthenticated } from '@src/middlewares/ensureAuthenticated';
import UserMusicsService from '@src/services/UserMusicsService';
import { BaseController } from '.';

@Controller('userMusics')
@ClassMiddleware(ensureAuthenticated)
export class UserMusicsController extends BaseController {
  @Post('')
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { musics } = request.body;

      const user_id = request.user.id;

      const createUserMusicsService = new CreateUserMusicsService();

      const userMusics = await createUserMusicsService.execute({
        user_id,
        musics,
      });

      return response.status(201).json(userMusics);
    } catch (error) {
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }

  @Get('')
  @Middleware(ensureAuthenticated)
  public async search(request: Request, response: Response): Promise<Response> {
    try {
      const user_id = request.user.id;
      const { page, pageSize } = request.query;

      const userMusicsService = new UserMusicsService();

      const userMusics = await userMusicsService.execute({
        user_id: String(user_id || ''),
        page: Number(page),
        pageSize: Number(pageSize),
      });

      return response.json(userMusics);
    } catch (error) {
      console.log(error);
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }
}
