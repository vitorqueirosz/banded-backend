import { User } from '@src/models/User';
import { BandResponse } from '@src/services/FindBandByFiltersService';

export interface Response {
  name: string;
  city: string;
  image: string;
  owner: Omit<User, 'password'>;
  genres: Array<{ name: string }>;
}

export function formatBandResponse(band: BandResponse): Response {
  const bandResponse = {
    id: band.id,
    name: band.name,
    city: band.city,
    image: band.image,
    owner: {
      id: band.owner.id,
      name: band.owner.name,
      email: band.owner.email,
      city: band.owner.city,
      avatar: band.owner.avatar,
    },
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
    members: band.members?.map(member => ({
      id: member.id || member.user.id,
      name: member.name || member.user.name,
      instrument: member.instrument,
    })),
    genres: band.genres.map(g => ({
      id: g.id,
      name: g.name,
    })),
  };

  return bandResponse;
}
