import { Band } from '@src/models/Band';
import { BandMusics } from '@src/models/BandMusics';
import { Genre } from '@src/models/Genre';
import { User } from '@src/models/User';

import { formatBandResponse, Response } from '@src/utils/formatBandResponse';

interface Request {
  id: string;
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

class FindBandService {
  public async execute({ id }: Request): Promise<Response> {
    const band = await Band.findOne({
      _id: id,
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

    return formatBandResponse(band);
  }
}

export default FindBandService;
