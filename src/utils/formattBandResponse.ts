import { BandResponse } from '@src/services/FindBandByFiltersService';

interface Response {
  name: string;
  city: string;
  image: string;
  genres: Array<{ name: string }>;
}

export function formattBandResponse(bands: BandResponse[]): Response[] {
  const bandResponse = bands.map((band: BandResponse) => ({
    name: band.name,
    city: band.city,
    image: band.image,
    genres: band.genre.map(g => ({
      name: g.genre.name,
    })),
  }));

  return bandResponse;
}
