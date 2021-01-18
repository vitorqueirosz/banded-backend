import { Controller, Post } from '@overnightjs/core';

import { Genre } from '@src/models/Genre';

import { Request, Response } from 'express';

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
}
