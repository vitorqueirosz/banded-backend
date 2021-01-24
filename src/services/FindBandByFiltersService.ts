import { Band } from '@src/models/Band';
import { BandMembers } from '@src/models/BandMembers';
import { BandMusics } from '@src/models/BandMusics';
import { Genre } from '@src/models/Genre';
import { User } from '@src/models/User';

import { formatBandsResponse, Response } from '@src/utils/formatBandsResponse';

interface Request {
  name: string;
  genre: string;
  city: string;
}

export interface GenreResponse {
  id: string;
  name: string;
}

export interface BandMusic extends Omit<BandMusics, 'genre'> {
  genre: Genre;
  id: string;
}

export interface UserResponse extends Omit<User, '_id'> {
  id: string;
}

export interface MembersResponse extends Omit<BandMembers, 'user'> {
  id: string;
  user: UserResponse;
}
export interface BandResponse {
  id: string;
  name: string;
  image: string;
  city: string;
  genres: GenreResponse[];
  owner: UserResponse;
  musics: BandMusic[];
  members: MembersResponse[];
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

      return formatBandsResponse(bands);
    }

    const bands = await Band.find({
      city: new RegExp(city),
      name: new RegExp(name),
    }).populate([
      {
        path: 'genres',
        model: 'Genre',
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
