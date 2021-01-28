import { Band } from '@src/models/Band';
import { User } from '@src/models/User';
import { UserMusician } from '@src/models/UserMusician';

import {
  formattedUserMusiciansResponse,
  Response,
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
  public async execute(): Promise<Response[]> {
    const userMusicians = await UserMusician.find().populate([
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
    ]);

    return formattedUserMusiciansResponse(userMusicians);
  }
}

export default FindUserMusiciansService;
