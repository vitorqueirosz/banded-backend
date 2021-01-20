import { Band } from '@src/models/Band';

import { formattBandResponse } from '@src/utils/formattBandResponse';

interface Request {
  name: string;
  genre: string;
  city: string;
}

export interface GenreResponse {
  genre: {
    id: string;
    name: string;
  };
}

export interface BandResponse extends Band {
  genre: GenreResponse[];
}

class FindBandByFiltersService {
  public async execute({ name, genre, city }: Request): Promise<any> {
    if (genre) {
      const bands = await Band.find({
        genres: genre,
        city: new RegExp(city),
        name: new RegExp(name),
      }).populate([
        {
          path: 'genre',
          model: 'BandGenres',
          populate: {
            path: 'genre',
            model: 'Genre',
          },
        },
        {
          path: 'owner',
          model: 'User',
        },
      ]);

      return formattBandResponse(bands);
    }

    const bands = await Band.find({
      city: new RegExp(city),
      name: new RegExp(name),
    }).populate([
      {
        path: 'genre',
        model: 'BandGenres',
        populate: {
          path: 'genre',
          model: 'Genre',
        },
      },
      {
        path: 'owner',
        model: 'User',
      },
    ]);

    return formattBandResponse(bands);
  }
}

export default FindBandByFiltersService;
