import { Band } from '@src/models/Band';
import { BandGenres } from '@src/models/BandGenres';
import { BandMembers } from '@src/models/BandMembers';
import { BandMusics } from '@src/models/BandMusics';
import { User } from '@src/models/User';
import AuthService from '@src/services/authService';

describe('Band functional test', () => {
  const defaultUser = {
    name: 'John Smith',
    email: 'john@smith.com',
    password: 'teste123123',
    city: 'Salvador',
  };

  let token: string;

  beforeEach(async () => {
    await Band.deleteMany({});
    await User.deleteMany();
    await BandGenres.deleteMany();
    await BandMusics.deleteMany();
    await BandMembers.deleteMany();

    const user = await new User(defaultUser).save();
    token = AuthService.generateToken(user.toJSON());
  });

  describe('When creating a new band', () => {
    it('should create a new band succesfully', async () => {
      const newBand = {
        name: 'tsBand',
        genres: ['6001ee988f0c654298477bd1', '6001ee988f0c654298477bd2'],
        members: [{ name: 'Tie glaubermman', function: 'Baterista' }],
        musics: [
          {
            name: '2031',
            genre: '6001ee988f0c654298477bd1',
            band: '123123',
            duration: 2020202,
          },
        ],
        image: 'band-image',
        city: 'salvador',
      };

      const response = await global.testRequest
        .post('/band')
        .set({ 'x-access-token': token })
        .send(newBand);
      expect(response.status).toBe(201);
    });

    it('should not create a new band with incomplete data', async () => {
      const newBand = {
        genres: ['6001ee988f0c654298477bd1', '6001ee988f0c654298477bd2'],
        members: [{ name: 'Tie glaubermman', function: 'Baterista' }],
        musics: [
          {
            name: '2031',
            genre: '6001ee988f0c654298477bd1',
            band: '123123',
            duration: 2020202,
          },
        ],
        image: 'band-image',
        city: 'salvador',
      };

      const response = await global.testRequest
        .post('/band')
        .set({ 'x-access-token': token })
        .send(newBand);
      expect(response.status).toBe(400);
    });

    it('should not create a duplicated band for the same user', async () => {
      const newBand = {
        name: 'tsBand',
        genres: ['6001ee988f0c654298477bd1', '6001ee988f0c654298477bd2'],
        members: [{ name: 'Tie glaubermman', function: 'Baterista' }],
        musics: [
          {
            name: '2031',
            genre: '6001ee988f0c654298477bd1',
            duration: 2020202,
          },
        ],
        image: 'band-image',
        city: 'salvador',
      };

      await global.testRequest
        .post('/band')
        .set({ 'x-access-token': token })
        .send(newBand);
      const response = await global.testRequest
        .post('/band')
        .set({ 'x-access-token': token })
        .send(newBand);
      expect(response.status).toBe(400);
    });

    // it('should return a band with formatted response', async () => {
    //   const newBand = {
    //     name: 'tsBand',
    //     genres: ['600d995604c6f7323cce3abc', '600d995604c6f7323cce3abd'],
    //     members: [{ name: 'Tie glaubermman', function: 'Baterista' }],
    //     musics: [
    //       {
    //         name: '2031',
    //         genre: '600d995604c6f7323cce3abc',
    //         duration: 2020202,
    //       },
    //     ],
    //     image: 'band-image',
    //     city: 'salvador',
    //   };

    //   const bandResponse = await global.testRequest
    //     .post('/band')
    //     .set({ 'x-access-token': token })
    //     .send(newBand);

    //   const response = await global.testRequest
    //     .get(`/band/${bandResponse.body.id}`)
    //     .set({ 'x-access-token': token });

    //   const formatedBandResponse = {
    //     id: response.body.id,
    //     name: 'tsBand',
    //     city: 'salvador',
    //     image: 'fake-image',
    //     owner: {
    //       id: response.body.owner.id,
    //       name: 'John Smith',
    //       email: 'john@smith.com',
    //       city: 'Salvador',
    //     },
    //     musics: [
    //       {
    //         id: response.body.musics[0].id,
    //         name: '2031',
    //         duration: 2020202,
    //         genre: 'Rock',
    //       },
    //     ],
    //     members: [
    //       {
    //         id: response.body.members[0].id,
    //         name: 'Tie glaubermman',
    //         function: 'Baterista',
    //       },
    //     ],
    //     genres: [
    //       { id: response.body.genres[0].id, name: 'Rock' },
    //       { id: response.body.genres[1].id, name: 'Indie' },
    //     ],
    //   };

    //   expect(response.status).toBe(200);
    //   expect(response.body).toEqual(formatedBandResponse);
    // });
  });
});
