import { BandResponse } from '@src/services/FindBandByFiltersService';

export const checkBandsList = (bands: BandResponse[]): BandResponse[] => {
  return bands.filter(band => band.owner !== null);
};
