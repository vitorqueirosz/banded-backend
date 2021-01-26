import { User } from '@src/models/User';
import AuthService from '@src/services/authService';

describe('CreatUsers functional tests', () => {
  beforeEach(async () => {
    await User.deleteMany();
  });

  describe('When creating a new user with encrypted password', () => {
    it('should create a new user successfully', async () => {
      const newUser = {
        name: 'John Smith',
        email: 'john@smith.com',
        password: 'teste123123',
        city: 'Salvador',
      };

      const response = await global.testRequest.post('/users').send(newUser);
      await expect(
        AuthService.comparePasswords(newUser.password, response.body.password),
      ).resolves.toBeTruthy();
      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newUser,
          ...{ password: expect.any(String) },
        }),
      );
    });

    it('should return a validation error when try to create a new user with incomplete data', async () => {
      const newUser = {
        email: 'john@smith.com',
        password: 'teste123123',
        city: 'Salvador',
      };

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: 400,
        error: 'User validation failed: name: Path `name` is required.',
      });
    });

    it('should return a unauthorized when try to create a user that already exists in the database', async () => {
      const newUser = {
        name: 'John Smith',
        email: 'john@smith.com',
        password: 'teste123123',
        city: 'Salvador',
      };

      await new User(newUser).save();

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        error: 'User validation failed: email: already exists in the database.',
      });
    });

    it('should create a new user and user musician successfully', async () => {
      const newUser = {
        name: 'John Smith',
        email: 'john@smith.com',
        password: 'teste123123',
        city: 'Salvador',
        userMusician: {
          function: 'Baterista',
          bandsName: ['My Band'],
          musics: [
            {
              album_image: 'algum-image',
              album_name: 'algum-name',
              music_name: 'my-music',
              artist_name: 'artist-name',
              duration_ms: 2000,
            },
          ],
        },
      };

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(201);
    });
  });

  describe('When authenticatin a user', () => {
    it('should return a authenticated user', async () => {
      const newUser = {
        name: 'John Smith',
        email: 'john@smith.com',
        password: 'teste123123',
        city: 'Salvador',
      };

      await new User(newUser).save();

      const response = await global.testRequest
        .post('/users/sessions')
        .send({ email: newUser.email, password: newUser.password });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newUser,
          ...{ password: expect.any(String) },
          token: expect.any(String),
        }),
      );
    });

    it('should return a UNAUTHORIZED user', async () => {
      const newUser = {
        name: 'John Smith',
        email: 'john@smith.com',
        password: 'teste123123',
        city: 'Salvador',
      };

      await new User(newUser).save();

      const response = await global.testRequest
        .post('/users/sessions')
        .send({ email: 'wrong-email', password: newUser.password });

      expect(response.status).toBe(401);
    });

    it('should return a UNAUTHORIZED user when password does not match', async () => {
      const newUser = {
        name: 'John Smith',
        email: 'john@smith.com',
        password: 'teste123123',
        city: 'Salvador',
      };

      await new User(newUser).save();

      const response = await global.testRequest
        .post('/users/sessions')
        .send({ email: newUser.email, password: 'wrong-password' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        code: 401,
        error: 'Password does not match',
      });
    });
  });
});
