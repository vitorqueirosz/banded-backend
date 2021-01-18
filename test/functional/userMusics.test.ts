import { User } from '@src/models/User';
import { UserMusics } from '@src/models/UserMusics';
import AuthService from '@src/services/authService';

describe('When creating a new user musics list', () => {
  let token: string;

  const defaultUser = {
    name: 'John Smith',
    email: 'john2@smith.com',
    password: 'teste123123',
    city: 'Salvador',
  };

  beforeEach(async () => {
    await User.deleteMany();
    await UserMusics.deleteMany();

    const user = await new User(defaultUser).save();

    token = AuthService.generateToken(user.toJSON());
  });

  it('shoul create a new user musics list', async () => {
    const musics = [
      {
        album_image:
          'https://i.scdn.co/image/ab67616d0000b2736aca031ccc27d2e4dd829d14',
        album_name: '2014 Forest Hills Drive',
        music_name: 'No Role Modelz',
        artist_name: 'J.Cole',
        duration_ms: 292986,
      },
      {
        album_image:
          'https://i.scdn.co/image/ab67616d0000b273d381b6e0d9ffb31c47080079',
        album_name: 'An Awesome Wave',
        music_name: 'Breezeblocks',
        artist_name: 'alt-J',
        duration_ms: 227080,
      },
    ];

    const response = await global.testRequest
      .post('/userMusics')
      .set({ 'x-access-token': token })
      .send({ musics });
    expect(response.status).toBe(201);
  });

  it('should return a validation error when try to create with incomplete data', async () => {
    const musics = [] as UserMusics[];

    const response = await global.testRequest
      .post('/userMusics')
      .set({ 'x-access-token': token })
      .send({ musics });
    expect(response.status).toBe(401);
  });
});
