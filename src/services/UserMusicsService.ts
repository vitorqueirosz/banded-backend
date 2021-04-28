import { BandMembers } from '@src/models/BandMembers';
import { BandMusics } from '@src/models/BandMusics';
import { Genre } from '@src/models/Genre';
import { User } from '@src/models/User';
import { UserMusics } from '@src/models/UserMusics';
import AppError from '@src/utils/errors/appError';

interface Request {
  user_id: string;
  page: number;
  pageSize: number;
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

type UserMusicsResponse = {
  userMusics: UserMusics[];
  total: number;
};
class UserMusicsService {
  public async execute({
    user_id,
    page = 0,
    pageSize = 10,
  }: Request): Promise<UserMusicsResponse> {
    const user: User = await User.findOne({ _id: user_id });

    if (!user) {
      throw new AppError(400, 'User not found');
    }

    const musics: UserMusics[] = await UserMusics.find({
      user: user_id,
    })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return {
      userMusics: musics,
      total: musics?.length ?? 0,
    };
  }
}

export default UserMusicsService;
