import { User } from '@src/models/User';
import { BandResponse } from '@src/services/FindBandByFiltersService';

export interface Response {
  name: string;
  city: string;
  image: string;
  owner: Omit<User, 'password'>;
  genres: Array<{ name: string }>;
}

export function formatBandsResponse(bands: BandResponse[]): Response[] {
  const bandResponse = bands.map((band: BandResponse) => ({
    id: band.id,
    name: band.name,
    city: band.city,
    image: band.image,
    owner: {
      id: band.owner.id,
      name: band.owner.name,
      email: band.owner.email,
      city: band.owner.city,
    },
    albums: band.albums.map(album => ({
      id: album.id,
      name: album.name,
      year: album.year,
      genre: album.genre.name,
      musics: album.musics.map(music => ({
        id: music.id,
        name: music.name,
        duration: music.duration,
        album: music.album.name,
      })),
    })),
    musics: band.musics?.map(music => ({
      id: music.id,
      name: music.name,
      duration: music.duration,
      genre: music.genre.name,
      album: {
        id: music.album.id,
        name: music.album.name,
        year: music.album.year,
      },
    })),
    members: band.members?.map(member => ({
      id: member.id || member.user.id,
      name: member.name || member.user.name,
      function: member.function,
    })),
    genres: band.genres.map(g => ({
      id: g.genre.id,
      name: g.genre.name,
    })),
  }));

  return bandResponse;
}
