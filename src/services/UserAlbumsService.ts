import { BandMembers } from '@src/models/BandMembers';
import { BandMusics } from '@src/models/BandMusics';
import { Genre } from '@src/models/Genre';
import { User } from '@src/models/User';
import { UserAlbums } from '@src/models/UserAlbums';
import AppError from '@src/utils/errors/appError';

interface Request {
  user_id: string;
  pageSize: number;
  page: number;
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

type UserAlbumsResponse = {
  albums: UserAlbums[];
  total: number;
};
class UserAlbumsService {
  public async execute({
    user_id,
    page = 0,
    pageSize = 6,
  }: Request): Promise<UserAlbumsResponse> {
    const user: User = await User.findOne({ _id: user_id });

    if (!user) {
      throw new AppError(400, 'User not found');
    }

    const totalUserAlbums = await UserAlbums.count({
      user: user_id,
    });

    const albums: UserAlbums[] = await UserAlbums.find({
      user: user_id,
    })
      .skip(page * pageSize)
      .limit(pageSize)
      .populate([
        {
          path: 'musics',
          model: 'UserMusics',
        },
      ]);

    return { albums, total: totalUserAlbums };
  }
}

export default UserAlbumsService;
