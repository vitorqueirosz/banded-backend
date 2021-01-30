import { Band } from '@src/models/Band';
import { BandAlbums } from '@src/models/BandAlbums';
import { BandGenres } from '@src/models/BandGenres';
import { BandMembers } from '@src/models/BandMembers';
import { BandMusics } from '@src/models/BandMusics';
import { User } from '@src/models/User';

import { formatBandsResponse, Response } from '@src/utils/formatBandsResponse';

interface Request {
  name: string;
  genre: string;
  city: string;
}

export interface Genre {
  name: string;
  id?: string;
}
export interface GenreResponse extends Omit<BandGenres, '_id'> {
  id: string;
  name: string;
  genre: Genre;
}

export interface BandMusic extends Omit<BandMusics, 'genre'> {
  genre: Genre;
  id?: string;
}

export interface UserResponse extends Omit<User, '_id'> {
  id: string;
}

export interface MembersResponse extends Omit<BandMembers, 'user'> {
  id: string;
  user: UserResponse;
}

export interface BandAlbumsResponse extends Omit<BandAlbums, '_id'> {
  id: string;
}
export interface BandResponse {
  id: string;
  name: string;
  image: string;
  city: string;
  genres: GenreResponse[];
  owner: UserResponse;
  musics: BandMusic[];
  albums: BandAlbumsResponse[];
  members: MembersResponse[];
}

class FindBandByFiltersService {
  public async execute({ name, genre, city }: Request): Promise<Response[]> {
    if (genre) {
      const bands = await Band.find({
        genres: (genre as unknown) as BandGenres,
        city: new RegExp(city),
        name: new RegExp(name),
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

    const bands = await Band.find({
      city: new RegExp(city),
      name: new RegExp(name),
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

export default FindBandByFiltersService;
