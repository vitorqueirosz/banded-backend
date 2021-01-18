import * as HTTPUtil from '@src/utils/request';

import { InternalError } from '@src/utils/errors/internalError';

export interface ExternalUrls {
  spotify: string;
}

export interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface ExternalUrls2 {
  spotify: string;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface Album {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: ExternalUrls2;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

export interface ExternalUrls3 {
  spotify: string;
}

export interface Artist2 {
  external_urls: ExternalUrls3;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface ExternalIds {
  isrc: string;
}

export interface ExternalUrls4 {
  spotify: string;
}

export interface Track {
  album: Album;
  artists: Artist2[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls4;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
}

export interface Music {
  track: Track;
  played_at: Date;
  context?: any;
}

interface MusicsResponse {
  items: Music[];
}

interface NormalizedMusic {
  artist: string;
  album_image: string;
  album_name: string;
  music_name: string;
  duration_ms: number;
}

interface Musics {
  musics: NormalizedMusic[];
}

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage = `Unexpected error when trying to communicate to SpotifyClient`;
    super(`${internalMessage}: ${message}`);
  }
}

export class SpotifyResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage = `Unexpected error when trying to communicate to SpotifyClient`;
    super(`${internalMessage}: ${message}`);
  }
}

class SpotifyClient {
  constructor(protected request = new HTTPUtil.Request()) {}

  public async fetchMusics() {
    try {
      const musics = await this.request.get<MusicsResponse>(
        'https://api.spotify.com/v1/me/player/recently-played',
        {
          headers: {
            Authorization:
              'BQBUUFEw0keoirXaFduayGk2XEBeJSKyOs8fG1eFVXV_SDW0Wx6whDP4CMv9De7OdFrH5AHfJEEFz1LB1av_MtdeHyvvkmv436dcdyVIpihAMcfE6tl4vT2KOCjLCYIqDkLYd5pUbajPGiv1yGYH-LYfT_f4Q_UNWWTT2Mhqq5qg_6-Nh_GhZ1yfLEiGUv6GFC_MN5eGg7RVtkk0qmTRzj7_mHDDD2THSzPbwr8ENiKQHgHXH6X13JNzZXTClIYr-vyi4cZPlUDDo9G4LAfl4TwO',
          },
        },
      );

      return this.normalizeResponse(musics.data);
    } catch (err) {
      if (HTTPUtil.Request.isRequestError(err)) {
        throw new SpotifyResponseError(`Error: { error: ${err.error.message}, statusCode: ${err.error.status}}
        `);
      }

      throw new ClientRequestError(err.message);
    }
  }

  public normalizeResponse(musics: MusicsResponse): Musics {
    const normalizedMusics = musics.items.map(music => ({
      artist: music.track.artists[0].name,
      album_image: music.track.album.images[0].url,
      album_name: music.track.album.name,
      music_name: music.track.name,
      duration_ms: music.track.duration_ms,
    }));

    return { musics: normalizedMusics };
  }
}

export default SpotifyClient;
