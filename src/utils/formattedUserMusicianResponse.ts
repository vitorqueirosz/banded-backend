import { UserMusics } from '@src/models/UserMusics';
import { UserMusicianResponse } from '@src/services/FindUserMusiciansService';

export interface Response {
  user: {
    id: any;
    name: string;
    city: string;
    email: string;
    instrument: string;
  };
  bands: {
    name: string;
  }[];
  musics: UserMusics[];
}

export interface MusicianResponse {
  id: any;
  name: string;
  city: string;
  email: string;
  instrument: string;
  bands: number;
  musics: number;
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
      instrument: userMusician.instrument,
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

export function formattedUserMusician(
  userMusicians: UserMusicianResponse[],
): MusicianResponse[] {
  const userMusiciansResponse = userMusicians.map(userMusician => ({
    id: userMusician.user.id,
    name: userMusician.user.name,
    city: userMusician.user.city,
    image: userMusician.user.avatar,
    email: userMusician.user.email,
    instrument: userMusician.instrument,
    bands: [...userMusician.bands, ...userMusician.bandsName].length,
    musics: userMusician.musics.length,
  }));

  return userMusiciansResponse;
}
