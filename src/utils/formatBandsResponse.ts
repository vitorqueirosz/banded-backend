import { User } from '@src/models/User';
import { BandResponse } from '@src/services/FindBandByFiltersService';
import { setBaseUrlOnImage } from './setBaseUrlOnImage';

export interface Response {
  name: string;
  city: string;
  image: string;
  owner: Omit<User, 'password'>;
  genres: Array<{ name: string }>;
}

export interface BandsResponse {
  id: string;
  name: string;
  city: string;
  image: string;
  albums: number;
  members: number;
  musics: number;
  genres: Array<{ name: string }>;
}

export function formatBandsResponse(bands: BandResponse[]): Response[] {
  const bandResponse = bands.map(band => ({
    id: band.id,
    name: band.name,
    city: band.city,
    image: setBaseUrlOnImage(band.image),
    owner: {
      id: band.owner.id,
      name: band.owner.name,
      email: band.owner.email,
      city: band.owner.city,
      avatar: band.owner.avatar,
    },
    albums: band.albums.map(album => ({
      id: album.id,
      name: album.name,
      year: album.year,
      genre: album.genre.name,
      // musics: album.musics.map(music => ({
      //   id: music.id,
      //   name: music.name,
      //   duration: music.duration,
      //   album: music.album.name,
      // })),
    })),
    musics: band.musics?.map(music => ({
      id: music.id,
      name: music.name,
      duration: music.duration,
      genre: music?.genre?.name,
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
  }));

  return bandResponse;
}

export function formatBands(bands: BandResponse[]): BandsResponse[] {
  const bandResponse = bands.map(band => ({
    id: band.id,
    name: band.name,
    city: band.city,
    image: setBaseUrlOnImage(band.image),
    albums: band.albums.length,
    musics: band.musics?.length,
    members: band.members?.length,
    genres: band.genres.map(g => ({
      id: g.id,
      name: g.name,
    })),
  }));

  return bandResponse;
}
