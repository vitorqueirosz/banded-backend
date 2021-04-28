import { UserAlbums } from '@src/models/UserAlbums';
import { UserMusician } from '@src/models/UserMusician';
import { UserMusics } from '@src/models/UserMusics';
import AppError from '@src/utils/errors/appError';

interface Request {
  user_id: string;
  albums: UserAlbums[];
}

class CreateUserAlbumsService {
  public async execute({ user_id, albums }: Request): Promise<void[]> {
    if (!albums.length) {
      throw new AppError(401, 'Incomplete data');
    }

    const userAlbums = await Promise.all(
      albums.map(async album => {
        const { album_image, album_name, year_release } = album;

        const userMusician = new UserAlbums({
          album_image,
          album_name,
          year_release,
          user: user_id,
        });

        await userMusician.save();

        await Promise.all(
          album.musics.map(async (music: UserMusics) => {
            const userAlbumsMusics = new UserMusics({
              ...music,
              user: user_id,
            });

            await userAlbumsMusics.save();

            userMusician.musics.push(userAlbumsMusics);
          }),
        );

        await UserMusician.findOneAndUpdate(
          { user: user_id as any },
          { $push: { albums: userMusician as any } },
        );
      }),
    );

    return userAlbums;
  }
}

export default CreateUserAlbumsService;
