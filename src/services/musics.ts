import SpotifyClient from '@src/client/spotify';

import { UserMusics, UserMusicsModel } from '@src/models/UserMusics';

export class MusicsService {
  constructor(protected spotifyClient = new SpotifyClient()) {}

  public async execute(user_id: string): Promise<UserMusicsModel> {
    const { musics } = await this.spotifyClient.fetchMusics();

    const findMusics = await UserMusics.findOneAndUpdate(
      { user_id },
      {
        new: true,
      },
    );

    if (findMusics) {
      return findMusics;
    }

    const userMusics = await UserMusics.create(musics);

    return userMusics;
  }
}
