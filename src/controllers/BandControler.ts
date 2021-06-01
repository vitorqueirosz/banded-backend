import { Controller, Post, Get, Middleware } from '@overnightjs/core';
import { ensureAuthenticated } from '@src/middlewares/ensureAuthenticated';
import AddBandMemberService from '@src/services/AddBandMemberService';
import uploadConfig from '@src/config/upload';
import multer from 'multer';
import CreateBandService from '@src/services/CreateBandService';
import FindBandByFiltersService from '@src/services/FindBandByFiltersService';
import FindBandService from '@src/services/FindBandService';
import FindBandsService from '@src/services/FindBandsService';
import { Request, Response } from 'express';
import { getImageByPreview } from '@src/utils/getImage';
import { BaseController } from '.';

const upload = multer(uploadConfig);

@Controller('band')
export class BandController extends BaseController {
  @Post('')
  @Middleware([ensureAuthenticated, upload.array('image')])
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const {
        name,
        city,
        musics,
        genres,
        members,
        albums,
        bandImage,
      } = request.body;

      const owner = request.user.id;
      const images = request.files as Express.Multer.File[];

      const createBandService = new CreateBandService();

      const band = await createBandService.execute({
        name,
        city,
        musics: JSON.parse(musics),
        albums: JSON.parse(albums),
        genres: JSON.parse(genres),
        members: JSON.parse(members),
        owner,
        image: getImageByPreview(images, bandImage),
      });

      return response.status(201).json(band);
    } catch (error) {
      console.log(error);
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }

  @Post('member')
  public async add(request: Request, response: Response): Promise<Response> {
    try {
      const { user_id, band_id, instrument } = request.body;

      const addBandMemberService = new AddBandMemberService();

      const bandMember = await addBandMemberService.execute({
        user_id,
        band_id,
        instrument,
      });

      return response.json(bandMember);
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
      const { name, genres, city } = request.query;

      const findBandByFiltersService = new FindBandByFiltersService();

      const band = await findBandByFiltersService.execute({
        name: String(name || ''),
        genres: (genres as string[]) ?? [],
        city: String(city || ''),
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
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }
}
