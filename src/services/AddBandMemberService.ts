import { Band } from '@src/models/Band';
import { BandMembers, BandMembersModel } from '@src/models/BandMembers';
import { User } from '@src/models/User';
import { UserMusician } from '@src/models/UserMusician';

import AppError from '@src/utils/errors/appError';

interface Request {
  user_id: string;
  band_id: string;
  memberFunction: string;
}

class AddBandMemberService {
  public async execute({
    user_id,
    band_id,
    memberFunction,
  }: Request): Promise<BandMembersModel> {
    const bandExists = await Band.findOne({ _id: band_id });

    if (!bandExists) {
      throw new AppError(400, 'Band not found!');
    }

    const userMusicianExists = await UserMusician.findOne({
      user: (user_id as unknown) as User,
    });

    if (!userMusicianExists) {
      throw new AppError(400, 'The user must be a musician!');
    }

    const userBands = await BandMembers.find({ user: user_id });

    if (userBands.length >= 3) {
      throw new AppError(
        400,
        'This user already reached the maximum bands possible',
      );
    }

    const userOnBand = await BandMembers.findOne({
      user: user_id,
      band: band_id,
    });

    if (userOnBand) {
      throw new AppError(400, 'Member already added to this band!');
    }

    const bandMember = await BandMembers.create({
      function: memberFunction,
      user: user_id,
      band: band_id,
    });

    await UserMusician.findOneAndUpdate(
      { user: (user_id as unknown) as User },
      { $push: { bands: band_id as any } },
    );

    return bandMember;
  }
}

export default AddBandMemberService;
