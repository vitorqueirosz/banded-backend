import { User } from '@src/models/User';
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

    const userMusicsExists = await UserMusics.find({
      user: user_id,
    });

    if (userMusicsExists.length) {
      await UserMusics.deleteMany({
        user: user_id,
      });
    }

    const userMusics = await Promise.all(
      musics.map(async music => {
        const userMusician = new UserMusics({ ...music, user: user_id });

        userMusician.save();

        await UserMusician.findOneAndUpdate(
          { user: (user_id as unknown) as User },
          { $push: { musics: userMusician as any } },
        );
      }),
    );

    return userMusics;
  }
}

export default CreateUserMusicsService;
