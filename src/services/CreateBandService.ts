import { Band, BandModel } from '@src/models/Band';
import { BandMusics } from '@src/models/BandMusics';
import { BandMembers } from '@src/models/BandMembers';
import { BandGenres } from '@src/models/BandGenres';
import AppError from '@src/utils/errors/appError';
import { UserMusician } from '@src/models/UserMusician';
import { User } from '@src/models/User';

interface Request {
  name: string;
  city: string;
  owner: string;
  image: string;
  musics: BandMusics[];
  genres: string[];
  members: BandMembers[];
}

class CreateBandService {
  public async execute({
    name,
    city,
    musics,
    genres,
    members,
    owner,
    image,
  }: Request): Promise<BandModel> {
    const bandExists = await Band.findOne({ owner, name });

    if (bandExists) {
      throw new AppError(400, 'Band Already exists');
    }

    const band = await Band.create({
      name,
      city,
      owner,
      image,
      genres: [...genres],
    });

    await UserMusician.findOneAndUpdate(
      { user: (owner as unknown) as User },
      { $push: { bands: band._id } },
    );

    if (musics.length) {
      await Promise.all(
        musics.map(music =>
          BandMusics.create({
            name: music.name,
            genre: music.genre,
            band: band._id,
            duration: music.duration,
          }),
        ),
      );
    }

    if (members.length) {
      await Promise.all(
        members.map(member =>
          BandMembers.create({
            user: member.user ? member.user : null,
            name: member.name,
            function: member.function,
            band: band._id,
          }),
        ),
      );
    }

    await Promise.all(
      genres.map(genre =>
        BandGenres.create({
          genre,
          band: band._id,
        }),
      ),
    );

    return band;
  }
}

export default CreateBandService;
