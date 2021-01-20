import { User } from '@src/models/User';
import { BandResponse } from '@src/services/FindBandByFiltersService';

export interface Response {
  name: string;
  city: string;
  image: string;
  owner: Omit<User, 'password'>;
  genres: Array<{ name: string }>;
}

export function formattBandResponse(bands: BandResponse[]): Response[] {
  const bandResponse = bands.map((band: BandResponse) => ({
    name: band.name,
    city: band.city,
    image: band.image,
    owner: {
      name: band.owner.name,
      email: band.owner.email,
      city: band.owner.city,
    },
    musics: band.musics?.map(music => ({
      name: music.name,
      duration: music.duration,
      genre: music.genre.name,
    })),
    members: band.members?.map(member => ({
      name: member.name,
      function: member.function,
    })),
    genres: band.genre.map(g => ({
      name: g.genre.name,
    })),
  }));

  return bandResponse;
}
