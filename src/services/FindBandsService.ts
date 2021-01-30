import { Band } from '@src/models/Band';
import { BandMusics } from '@src/models/BandMusics';
import { Genre } from '@src/models/Genre';
import { User } from '@src/models/User';

import { formatBandsResponse, Response } from '@src/utils/formatBandsResponse';

interface Request {
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

class FindBandsService {
  public async execute({ city }: Request): Promise<Response[]> {
    const bands = await Band.find({
      city: new RegExp(city),
    }).populate([
      {
        path: 'genres',
        model: 'BandGenres',
        populate: {
          path: 'genre',
          model: 'Genre',
        },
      },
      {
        path: 'albums',
        model: 'BandAlbums',
        populate: {
          path: 'genre',
          model: 'Genre',
        },
      },
      {
        path: 'albums',
        model: 'BandAlbums',
        populate: {
          path: 'musics',
          model: 'BandMusics',
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
        path: 'musics',
        model: 'BandMusics',
        populate: {
          path: 'album',
          model: 'BandAlbums',
        },
      },
      {
        path: 'members',
        model: 'BandMembers',
        populate: {
          path: 'user',
          model: 'User',
        },
      },
      {
        path: 'owner',
        model: 'User',
      },
    ]);

    return formatBandsResponse(bands);
  }
}

export default FindBandsService;
