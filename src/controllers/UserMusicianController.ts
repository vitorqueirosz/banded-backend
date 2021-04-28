import { ClassMiddleware, Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import { ensureAuthenticated } from '@src/middlewares/ensureAuthenticated';

import { UserMusician } from '@src/models/UserMusician';
import { UserMusics } from '@src/models/UserMusics';
import FindUserMusiciansService from '@src/services/FindUserMusiciansService';
import { BaseController } from '.';

@Controller('userMusician')
@ClassMiddleware(ensureAuthenticated)
export class UserMusicianController extends BaseController {
  @Post('')
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { bands, bandsName, musics, instrument } = request.body;

      const user = request.user.id;

      const musician = await UserMusician.create({
        bands,
        bandsName,
        instrument,
      });

      await Promise.all(
        musics.map(async (music: UserMusics) => {
          const userMusics = new UserMusics({ ...music, user });

          await userMusics.save();

          musician.musics.push(userMusics);
        }),
      );

      await musician.save();

      return response.status(201).json(musician);
    } catch (error) {
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }

  @Get('')
  public async index(request: Request, response: Response): Promise<Response> {
    try {
      const { city } = request.body;

      const findUserMusiciansService = new FindUserMusiciansService();

      const userMusicians = await findUserMusiciansService.execute();

      return response.json(userMusicians);
    } catch (error) {
      console.log(error);
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }
}
