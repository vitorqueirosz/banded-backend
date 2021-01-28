import { UserMusics } from '@src/models/UserMusics';
import { UserMusicianResponse } from '@src/services/FindUserMusiciansService';

export interface Response {
  user: {
    id: any;
    name: string;
    city: string;
    email: string;
    function: string;
  };
  bands: {
    name: string;
  }[];
  musics: UserMusics[];
}

export function formattedUserMusiciansResponse(
  userMusicians: UserMusicianResponse[],
): Response[] {
  const userMusiciansResponse = userMusicians.map(userMusician => ({
    user: {
      id: userMusician.user.id,
      name: userMusician.user.email,
      city: userMusician.user.city,
      email: userMusician.user.email,
      function: userMusician.function,
    },
    bands: [
      ...userMusician.bands.map(b => ({
        id: b.id,
        name: b.name,
      })),
      ...userMusician.bandsName.map(b => ({ name: b })),
    ],
    musics: userMusician.musics,
  }));

  return userMusiciansResponse;
}
