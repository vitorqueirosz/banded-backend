import { Band } from '@src/models/Band';
import { User } from '@src/models/User';
import { UserMusician } from '@src/models/UserMusician';

import {
  formattedUserMusician,
  MusicianResponse,
} from '@src/utils/formattedUserMusicianResponse';

export interface GenreResponse {
  genre: {
    id: string;
    name: string;
  };
}

interface UserResponse extends Omit<User, '_id'> {
  id: string;
}

interface BandResponse extends Omit<Band, '_id'> {
  id: string;
}
export interface UserMusicianResponse extends Omit<UserMusician, 'user'> {
  user: UserResponse;
  bands: BandResponse[];
}

class FindUserMusiciansService {
  public async execute(): Promise<MusicianResponse[]> {
    const userMusicians: UserMusicianResponse[] = await UserMusician.find().populate(
      [
        {
          path: 'user',
          model: 'User',
        },
        {
          path: 'musics',
          model: 'UserMusics',
        },
        {
          path: 'bands',
          model: 'Band',
        },
      ],
    );

    const checkUserList = (
      users: UserMusicianResponse[],
    ): UserMusicianResponse[] => {
      return users.filter(user => user.user !== null);
    };

    return formattedUserMusician(checkUserList(userMusicians));
  }
}

export default FindUserMusiciansService;
