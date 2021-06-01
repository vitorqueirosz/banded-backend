import { Band, BandModel } from '@src/models/Band';
import { BandMusics } from '@src/models/BandMusics';
import { BandMembers } from '@src/models/BandMembers';
import AppError from '@src/utils/errors/appError';
import { UserMusician } from '@src/models/UserMusician';
import { User } from '@src/models/User';
import { BandAlbums } from '@src/models/BandAlbums';

interface Request {
  name: string;
  city: string;
  owner: string;
  image?: string;
  musics: BandMusics[];
  genres: string[];
  members: BandMembers[];
  albums: BandAlbums[];
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
    albums,
  }: Request): Promise<BandModel> {
    const user: User = await User.findOne({ _id: owner });

    if (!user) {
      throw new AppError(400, 'User not found');
    }

    const bandExists = await Band.findOne({ owner, name });
    const limitBandExists = await Band.find({ owner });

    if (bandExists) {
      throw new AppError(400, 'Band Already exists');
    }

    if (limitBandExists.length >= 3) {
      throw new AppError(400, 'You reached the maximum bands possible');
    }

    const band = await Band.create({
      name,
      city,
      owner,
      image,
      genres,
    });

    if (albums.length) {
      await Promise.all(
        albums.map(async album => {
          const bandAlbum = new BandAlbums({
            name: album.name,
            genre: album.genre,
            year_release: album.year_release,
            iamge: album.image,
            band: band._id,
          });

          album.musics.map(async music => {
            const bandMusic = new BandMusics({
              ...music,
              genre: album.genre,
              band: band._id,
              album: bandAlbum._id,
            });

            bandAlbum.musics.push(bandMusic);

            await bandMusic.save();
          });
          band.albums.push(bandAlbum._id);
          await bandAlbum.save();
        }),
      );
    }

    await UserMusician.findOneAndUpdate(
      { user: owner as any },
      { $push: { bands: band._id } },
    );

    if (musics.length) {
      await Promise.all(
        musics.map(async music => {
          const bandMusic = new BandMusics({
            ...music,
            band: band._id,
          });

          await bandMusic.save();

          band.musics.push(bandMusic);
        }),
      );
    }

    if (members.length) {
      await Promise.all(
        members.map(async member => {
          const bandMember = new BandMembers({ ...member, band: band._id });

          await bandMember.save();
          band.members.push(bandMember);

          if (member.user) {
            await UserMusician.findOneAndUpdate(
              { user: member._id as any },
              { $push: { bands: band._id } },
            );
          }
        }),
      );
    }

    // await Promise.all(
    //   genres.map(async genre => {
    //     const bandGenre = new BandGenres({ genre, band: band._id });

    //     await bandGenre.save();

    //     band.genres.push(bandGenre);
    //   }),
    // );

    await band.save();

    return band;
  }
}

export default CreateBandService;
