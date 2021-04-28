import { UserMusician } from '@src/models/UserMusician';
import { UserMusics } from '@src/models/UserMusics';
import AppError from '@src/utils/errors/appError';

interface Request {
  user_id: string;
  musics: UserMusics[];
}

class CreateUserMusicsService {
  public async execute({ user_id, musics }: Request): Promise<void[]> {
    if (!musics.length) {
      throw new AppError(401, 'Incomplete data');
    }

    const userMusics = await Promise.all(
      musics.map(async music => {
        const userMusician = new UserMusics({ ...music, user: user_id });

        await userMusician.save();

        await UserMusician.findOneAndUpdate(
          { user: user_id as any },
          { $push: { albums: userMusician as any } },
        );
      }),
    );

    return userMusics;
  }
}

export default CreateUserMusicsService;
