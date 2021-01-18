import { Controller, ClassMiddleware, Post, Get } from '@overnightjs/core';
import { ensureAuthenticated } from '@src/middlewares/ensureAuthenticated';

import CreateBandService from '@src/services/CreateBandService';
import { Request, Response } from 'express';
import { BaseController } from '.';

@Controller('band')
@ClassMiddleware(ensureAuthenticated)
export class BandController extends BaseController {
  @Post('')
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { name, city, musics, genres, members } = request.body;

      const image = 'fake-image';

      const owner = request.user.id;

      const createBandService = new CreateBandService();

      const band = await createBandService.execute({
        name,
        city,
        musics,
        genres,
        members,
        owner,
        image,
      });

      return response.status(201).json(band);
    } catch (error) {
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }
}
