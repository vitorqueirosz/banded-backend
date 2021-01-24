import { Controller, ClassMiddleware, Post, Get } from '@overnightjs/core';
import { ensureAuthenticated } from '@src/middlewares/ensureAuthenticated';

import CreateBandService from '@src/services/CreateBandService';
import FindBandByFiltersService from '@src/services/FindBandByFiltersService';
import FindBandService from '@src/services/FindBandService';
import FindBandsService from '@src/services/FindBandsService';
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

  @Get('bandList')
  public async search(request: Request, response: Response): Promise<Response> {
    try {
      const { city } = request.query;

      const findBandsService = new FindBandsService();

      const bands = await findBandsService.execute({
        city: String(city) || '',
      });

      return response.json(bands);
    } catch (error) {
      console.log(error);
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }

  @Get('filters')
  public async find(request: Request, response: Response): Promise<Response> {
    try {
      const { name, genre, city } = request.query;

      const findBandByFiltersService = new FindBandByFiltersService();

      const band = await findBandByFiltersService.execute({
        name: String(name) || '',
        genre: String(genre) || '',
        city: String(city) || '',
      });

      return response.json(band);
    } catch (error) {
      console.log(error);
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }

  @Get(':id')
  public async index(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params;

      const findBandService = new FindBandService();

      const band = await findBandService.execute({
        id: String(id),
      });

      return response.json(band);
    } catch (error) {
      console.log(error);
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }
}
