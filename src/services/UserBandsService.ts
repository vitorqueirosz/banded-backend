import { Band } from '@src/models/Band';
import { BandMembers } from '@src/models/BandMembers';
import { BandMusics } from '@src/models/BandMusics';
import { Genre } from '@src/models/Genre';
import { User } from '@src/models/User';
import { UserMusician } from '@src/models/UserMusician';
import AppError from '@src/utils/errors/appError';

import { formatBands, Response } from '@src/utils/formatBandsResponse';

interface Request {
  user_id: string;
  page?: number;
  pageSize?: number;
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

interface BandToResponse {
  id: string;
  name: string;
  image: string;
  city: string;
  owner: UserResponse;
  genres: GenreResponse[];
  musics: BandMusic[];
  members: MembersResponse[];
}

interface BandResponse {
  band: BandToResponse;
}

type UserBandResponse = {
  userBands: Response[];
  total: number;
};
class UserBandService {
  public async execute({ user_id }: Request): Promise<UserBandResponse> {
    const user: User = await User.findOne({ _id: user_id });

    if (!user) {
      throw new AppError(400, 'User not found');
    }

    const bandsByUserMusician = await UserMusician.find({
      user: user_id,
    });

    const [bandsName] = bandsByUserMusician.map(
      (b: UserMusician) => b.bandsName,
    );

    const bands = await Band.find({
      owner: user_id,
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
        path: 'albums',
        model: 'BandAlbums',
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

    const formattedBandResponse = formatBands(bands);

    const userBands = await BandMembers.find({ user: user_id }).populate([
      {
        path: 'band',
        model: 'Band',
        populate: {
          path: 'genres',
          model: 'Genre',
        },
      },
      {
        path: 'band',
        model: 'Band',
        populate: {
          path: 'musics',
          model: 'BandMusics',
          populate: { path: 'genre', model: 'Genre' },
        },
      },
      {
        path: 'band',
        model: 'Band',
        populate: {
          path: 'members',
          model: 'BandMembers',
          populate: { path: 'user', model: 'User' },
        },
      },
      {
        path: 'band',
        model: 'Band',
        populate: { path: 'owner', model: 'User' },
      },
    ]);

    const userBandsResponse = userBands.map((userBand: BandResponse) => ({
      id: userBand.band.id,
      name: userBand.band.name,
      city: userBand.band.city,
      image: userBand.band.image,
      owner: {
        id: userBand.band.owner.id,
        name: userBand.band.owner.name,
        email: userBand.band.owner.email,
        city: userBand.band.owner.city,
      },
      musics: userBand.band.musics?.map(music => ({
        id: music.id,
        name: music.name,
        duration: music.duration,
        genre: music.genre.name,
      })),
      members: userBand.band.members?.map(member => ({
        id: member.id || member.user.id,
        name: member.name || member.user.name,
        instrument: member.instrument,
      })),
      genres: userBand.band.genres?.map(g => ({
        id: g.id,
        name: g.name,
      })),
    }));

    const mergedBandsResponse = [
      ...bandsName,
      ...formattedBandResponse,
      ...userBandsResponse,
    ];

    return {
      userBands: mergedBandsResponse,
      total: mergedBandsResponse.length,
    };
  }
}

export default UserBandService;
