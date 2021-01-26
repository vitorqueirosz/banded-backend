import { Band } from '@src/models/Band';
import { BandMusics } from '@src/models/BandMusics';
import { Genre } from '@src/models/Genre';
import { User } from '@src/models/User';
import { UserMusician } from '@src/models/UserMusician';

import { Response } from '@src/utils/formatBandsResponse';

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

    return userMusicians;
  }
}

export default FindUserMusiciansService;
