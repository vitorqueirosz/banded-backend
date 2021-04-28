import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { ensureAuthenticated } from '@src/middlewares/ensureAuthenticated';

import { Genre } from '@src/models/Genre';

import { Request, Response } from 'express';

interface CustomGenre {
  id: string;
  name: string;
}

@Controller('genres')
export class GenreController {
  @Post('')
  public async create(request: Request, response: Response): Promise<Response> {
    const data = [
      {
        name: 'Rock',
      },
      {
        name: 'Indie',
      },
      {
        name: 'Rap',
      },
      {
        name: 'Sertanejo',
      },
      {
        name: 'Grunje',
      },
      {
        name: 'Punk Rock',
      },
      {
        name: 'Metal',
      },
    ];

    const genres = await Promise.all(
      data.map(genre => new Genre(genre).save()),
    );

    return response.status(201).json(genres);
  }

  @Get('')
  @Middleware(ensureAuthenticated)
  public async index(request: Request, response: Response): Promise<Response> {
    const genres = await Genre.find();

    const formattedGenres = genres.map((genre: CustomGenre) => ({
      value: genre.id,
      label: genre.name,
    }));

    return response.json(formattedGenres);
  }
}
