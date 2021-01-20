import { Band } from '@src/models/Band';
import { BandMusics } from '@src/models/BandMusics';
import { Genre } from '@src/models/Genre';
import { User } from '@src/models/User';

import { formattBandResponse, Response } from '@src/utils/formattBandResponse';

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

interface BandMusic extends Omit<BandMusics, 'genre'> {
  genre: Genre;
}
export interface BandResponse extends Omit<Band, 'owner'> {
  genre: GenreResponse[];
  owner: User;
  musics: BandMusic[];
}

class FindBandByFiltersService {
  public async execute({ name, genre, city }: Request): Promise<Response[]> {
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
        path: 'musics',
        model: 'BandMusics',
        populate: {
          path: 'genre',
          model: 'Genre',
        },
      },
      {
        path: 'members',
        model: 'BandMembers',
      },
      {
        path: 'owner',
        model: 'User',
      },
    ]);

    return bands;
  }
}

export default FindBandByFiltersService;
