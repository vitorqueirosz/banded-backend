import { UserMusics, UserMusicsModel } from '@src/models/UserMusics';
import AppError from '@src/utils/errors/appError';

interface Request {
  user_id: string;
  musics: UserMusics[];
}

class CreateUserMusicsService {
  public async execute({
    user_id,
    musics,
  }: Request): Promise<UserMusicsModel[]> {
    if (!musics.length) {
      throw new AppError(401, 'Incomplete data');
    }

    const userMusicsExists = await UserMusics.find({
      user: user_id,
    });

    if (userMusicsExists.length) {
      await UserMusics.deleteMany({
        user: user_id,
      });
    }

    const userMusics = await Promise.all(
      musics.map(music =>
        UserMusics.create({
          user: user_id,
          album_image: music.album_image,
          album_name: music.album_name,
          music_name: music.music_name,
          artist_name: music.artist_name,
          duration_ms: music.duration_ms,
        }),
      ),
    );

    return userMusics;
  }
}

export default CreateUserMusicsService;
