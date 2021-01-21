import { ClassMiddleware, Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import CreateUserMusicsService from '@src/services/CreateUserMusicsService';

import { ensureAuthenticated } from '@src/middlewares/ensureAuthenticated';

import { UserMusics } from '@src/models/UserMusics';
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
  public async index(request: Request, response: Response): Promise<Response> {
    try {
      const user_id = request.user.id;

      const userMusics = await UserMusics.find({ user: user_id });

      return response.json(userMusics);
    } catch (error) {
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }
}
