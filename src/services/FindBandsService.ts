import { Band } from '@src/models/Band';
import { BandResponse } from '@src/services/FindBandByFiltersService';

import { formatBands, BandsResponse } from '@src/utils/formatBandsResponse';

interface Request {
  city: string;
}

class FindBandsService {
  public async execute({ city }: Request): Promise<BandsResponse[]> {
    const bands: BandResponse[] = await Band.find({
      city: new RegExp(city),
    }).populate([
      {
        path: 'genres',
        model: 'Genre',
      },
    ]);

    const checkedBands = (bandsArr: BandResponse[]): BandResponse[] => {
      return bandsArr.filter(band => band.owner !== null);
    };

    return formatBands(checkedBands(bands));
  }
}

export default FindBandsService;
