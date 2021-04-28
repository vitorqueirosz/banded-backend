import { Band } from '@src/models/Band';
import { BandAlbums } from '@src/models/BandAlbums';
import { BandGenres } from '@src/models/BandGenres';
import { BandMembers } from '@src/models/BandMembers';
import { BandMusics } from '@src/models/BandMusics';
import { User, UserModel } from '@src/models/User';
import { UserMusician } from '@src/models/UserMusician';
import AuthService from '@src/services/authService';

describe('Band functional test', () => {
  const defaultUser = {
    name: 'John Smith',
    email: 'john@smith.com',
    password: 'teste123123',
    city: 'Salvador',
  };

  let token: string;
  let user: UserModel;

  beforeEach(async () => {
    await Band.deleteMany({});
    await User.deleteMany();
    await BandGenres.deleteMany();
    await BandMusics.deleteMany();
    await BandMembers.deleteMany();
    await UserMusician.deleteMany();
    await BandAlbums.deleteMany();

    user = await new User(defaultUser).save();

    token = AuthService.generateToken(user.toJSON());
  });

  describe('When creating a new band', () => {
    it('should create a new band succesfully', async () => {
      const newBand = {
        name: 'tsBand',
        genres: ['6001ee988f0c654298477bd1', '6001ee988f0c654298477bd2'],
        members: [{ name: 'Tie glaubermman', instrument: 'Baterista' }],
        albums: [
          {
            name: 'initial-album',
            genre: '6001ee988f0c654298477bd1',
            year: 2012,
            musics: [
              {
                name: 'Nights',
                duration: 222555,
              },
              {
                name: 'Ivy',
                duration: 222555,
              },
            ],
          },
        ],
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

      const response = await global.testRequest
        .post('/band')
        .set({ authorization: `Bearer ${token}` })
        .send(newBand);
      expect(response.status).toBe(201);
    });

    // it('should not create a new band with incomplete data', async () => {
    //   const newBand = {
    //     genres: ['6001ee988f0c654298477bd1', '6001ee988f0c654298477bd2'],
    //     members: [{ name: 'Tie glaubermman', instrument: 'Baterista' }],
    //     musics: [
    //       {
    //         name: '2031',
    //         genre: '6001ee988f0c654298477bd1',
    //         band: '123123',
    //         duration: 2020202,
    //       },
    //     ],
    //     image: 'band-image',
    //     city: 'salvador',
    //   };

    //   const response = await global.testRequest
    //     .post('/band')
    //     .set({ authorization: `Bearer ${token}` })
    //     .send(newBand);
    //   expect(response.status).toBe(400);
    // });

    // it('should not create a duplicated band for the same user', async () => {
    //   const newBand = {
    //     name: 'tsBand',
    //     genres: ['6001ee988f0c654298477bd1', '6001ee988f0c654298477bd2'],
    //     members: [{ name: 'Tie glaubermman', instrument: 'Baterista' }],
    //     album: {
    //       name: 'initial-album',
    //       genre: '6001ee988f0c654298477bd1',
    //       year: 2012,
    //     },
    //     musics: [
    //       {
    //         name: '2031',
    //         genre: '6001ee988f0c654298477bd1',
    //         duration: 2020202,
    //       },
    //     ],
    //     image: 'band-image',
    //     city: 'salvador',
    //   };

    //   await global.testRequest
    //     .post('/band')
    //     .set({ authorization: `Bearer ${token}` })
    //     .send(newBand);
    //   const response = await global.testRequest
    //     .post('/band')
    //     .set({ authorization: `Bearer ${token}` })
    //     .send(newBand);
    //   expect(response.status).toBe(400);
    // });

    // it('should return an error typeof AppError when try to create more than three bands for unique user', async () => {
    //   const firstBand = {
    //     name: 'firstBand',
    //     genres: ['6001ee988f0c654298477bd1', '6001ee988f0c654298477bd2'],
    //     members: [{ name: 'Tie glaubermman', instrument: 'Baterista' }],
    //     album: {
    //       name: 'initial-album',
    //       genre: '6001ee988f0c654298477bd1',
    //       year: 2012,
    //     },
    //     musics: [
    //       {
    //         name: '2031',
    //         genre: '6001ee988f0c654298477bd1',
    //         duration: 2020202,
    //       },
    //     ],
    //     image: 'band-image',
    //     city: 'salvador',
    //   };

    //   const secondBand = {
    //     name: 'secondBand',
    //     genres: ['6001ee988f0c654298477bd1', '6001ee988f0c654298477bd2'],
    //     members: [{ name: 'Tie glaubermman', instrument: 'Baterista' }],
    //     album: {
    //       name: 'initial-album',
    //       genre: '6001ee988f0c654298477bd1',
    //       year: 2012,
    //     },
    //     musics: [
    //       {
    //         name: '2031',
    //         genre: '6001ee988f0c654298477bd1',
    //         duration: 2020202,
    //       },
    //     ],
    //     image: 'band-image',
    //     city: 'salvador',
    //   };

    //   const thirdBand = {
    //     name: 'thirdBand',
    //     genres: ['6001ee988f0c654298477bd1', '6001ee988f0c654298477bd2'],
    //     members: [{ name: 'Tie glaubermman', instrument: 'Baterista' }],
    //     album: {
    //       name: 'initial-album',
    //       genre: '6001ee988f0c654298477bd1',
    //       year: 2012,
    //     },
    //     musics: [
    //       {
    //         name: '2031',
    //         genre: '6001ee988f0c654298477bd1',
    //         duration: 2020202,
    //       },
    //     ],
    //     image: 'band-image',
    //     city: 'salvador',
    //   };

    //   const fourthBand = {
    //     name: 'fourthBand',
    //     genres: ['6001ee988f0c654298477bd1', '6001ee988f0c654298477bd2'],
    //     members: [{ name: 'Tie glaubermman', instrument: 'Baterista' }],
    //     album: {
    //       name: 'initial-album',
    //       genre: '6001ee988f0c654298477bd1',
    //       year: 2012,
    //     },
    //     musics: [
    //       {
    //         name: '2031',
    //         genre: '6001ee988f0c654298477bd1',
    //         duration: 2020202,
    //       },
    //     ],
    //     image: 'band-image',
    //     city: 'salvador',
    //   };

    //   await global.testRequest
    //     .post('/band')
    //     .set({ authorization: `Bearer ${token}` })
    //     .send(firstBand);

    //   await global.testRequest
    //     .post('/band')
    //     .set({ authorization: `Bearer ${token}` })
    //     .send(secondBand);

    //   await global.testRequest
    //     .post('/band')
    //     .set({ authorization: `Bearer ${token}` })
    //     .send(thirdBand);

    //   const response = await global.testRequest
    //     .post('/band')
    //     .set({ authorization: `Bearer ${token}` })
    //     .send(fourthBand);

    //   expect(response.status).toBe(400);
    //   expect(response.body).toEqual({
    //     code: 400,
    //     error: 'You reached the maximum bands possible',
    //   });
    // });

    // describe('When adding a new band member', () => {
    //   it('should create a new member on band', async () => {
    //     const userMusicianDefault = {
    //       name: 'Vitor Queiroz',
    //       email: 'vitor@gmail.com',
    //       password: 'vitor123123',
    //       city: 'salvador',
    //       userMusician: {
    //         instrument: 'Baterista',
    //         musics: [
    //           {
    //             album_image: 'algum-image',
    //             album_name: 'algum-name',
    //             music_name: 'my-music',
    //             artist_name: 'artist-name',
    //             duration_ms: 2000,
    //           },
    //         ],
    //       },
    //     };

    //     const userMusician = await global.testRequest
    //       .post('/users')
    //       .send(userMusicianDefault);

    //     const newBand = {
    //       name: 'tsBand',
    //       genres: ['6001ee988f0c654298477bd1', '6001ee988f0c654298477bd2'],
    //       members: [{ name: 'Tie glaubermman', instrument: 'Baterista' }],
    //       album: {
    //         name: 'initial-album',
    //         genre: '6001ee988f0c654298477bd1',
    //         year: 2012,
    //       },
    //       musics: [
    //         {
    //           name: '2031',
    //           genre: '6001ee988f0c654298477bd1',
    //           duration: 2020202,
    //         },
    //       ],
    //       image: 'band-image',
    //       city: 'salvador',
    //     };

    //     const bandResponse = await global.testRequest
    //       .post('/band')
    //       .set({ authorization: `Bearer ${token}` })
    //       .send(newBand);

    //     const response = await global.testRequest
    //       .post('/band/member')
    //       .set({ authorization: `Bearer ${token}` })
    //       .send({
    //         band_id: bandResponse.body.id,
    //         user_id: userMusician.body.user.id,
    //         memberinstrument: 'Guitarrista',
    //       });

    //     expect(response.status).toBe(200);
    //   });

    //   it('should not create a duplicate a member on same band', async () => {
    //     const userMusicianDefault = {
    //       name: 'Vitor Queiroz',
    //       email: 'vitor@gmail.com',
    //       password: 'vitor123123',
    //       city: 'salvador',
    //       userMusician: {
    //         instrument: 'Baterista',
    //         musics: [
    //           {
    //             album_image: 'algum-image',
    //             album_name: 'algum-name',
    //             music_name: 'my-music',
    //             artist_name: 'artist-name',
    //             duration_ms: 2000,
    //           },
    //         ],
    //       },
    //     };

    //     const userMusician = await global.testRequest
    //       .post('/users')
    //       .send(userMusicianDefault);

    //     const newBand = {
    //       name: 'tsBand',
    //       genres: ['6001ee988f0c654298477bd1', '6001ee988f0c654298477bd2'],
    //       members: [
    //         { name: 'Tie glaubermman', instrument: 'Baterista' },
    //         { user: userMusician.body.user.id, instrument: 'Vocalista' },
    //       ],
    //       album: {
    //         name: 'initial-album',
    //         genre: '6001ee988f0c654298477bd1',
    //         year: 2012,
    //       },
    //       musics: [
    //         {
    //           name: '2031',
    //           genre: '6001ee988f0c654298477bd1',
    //           duration: 2020202,
    //         },
    //       ],
    //       image: 'band-image',
    //       city: 'salvador',
    //     };

    //     const bandResponse = await global.testRequest
    //       .post('/band')
    //       .set({ authorization: `Bearer ${token}` })
    //       .send(newBand);

    //     const response = await global.testRequest
    //       .post('/band/member')
    //       .set({ authorization: `Bearer ${token}` })
    //       .send({
    //         band_id: bandResponse.body.id,
    //         user_id: userMusician.body.user.id,
    //         memberinstrument: 'Guitarrista',
    //       });

    //     expect(response.status).toBe(400);
    //     expect(response.body).toEqual({
    //       code: 400,
    //       error: 'Member already added to this band!',
    //     });
    //   });

    //   it('should not create a new band member for a user that already has three bands', async () => {
    //     const userMusicianDefault = {
    //       name: 'Vitor Queiroz',
    //       email: 'vitor@gmail.com',
    //       password: 'vitor123123',
    //       city: 'salvador',
    //       userMusician: {
    //         instrument: 'Baterista',
    //         musics: [
    //           {
    //             album_image: 'algum-image',
    //             album_name: 'algum-name',
    //             music_name: 'my-music',
    //             artist_name: 'artist-name',
    //             duration_ms: 2000,
    //           },
    //         ],
    //       },
    //     };

    //     const userMusician = await global.testRequest
    //       .post('/users')
    //       .send(userMusicianDefault);

    //     const firstBand = {
    //       name: 'firstBand',
    //       genres: ['6001ee988f0c654298477bd1', '6001ee988f0c654298477bd2'],
    //       members: [{ name: 'Tie glaubermman', instrument: 'Baterista' }],
    //       album: {
    //         name: 'initial-album',
    //         genre: '6001ee988f0c654298477bd1',
    //         year: 2012,
    //       },
    //       musics: [
    //         {
    //           name: '2031',
    //           genre: '6001ee988f0c654298477bd1',
    //           duration: 2020202,
    //         },
    //       ],
    //       image: 'band-image',
    //       city: 'salvador',
    //     };

    //     const secondBand = {
    //       name: 'secondBand',
    //       genres: ['6001ee988f0c654298477bd1', '6001ee988f0c654298477bd2'],
    //       members: [{ name: 'Tie glaubermman', instrument: 'Baterista' }],
    //       album: {
    //         name: 'initial-album',
    //         genre: '6001ee988f0c654298477bd1',
    //         year: 2012,
    //       },
    //       musics: [
    //         {
    //           name: '2031',
    //           genre: '6001ee988f0c654298477bd1',
    //           duration: 2020202,
    //         },
    //       ],
    //       image: 'band-image',
    //       city: 'salvador',
    //     };

    //     const thirdBand = {
    //       name: 'thirdBand',
    //       genres: ['6001ee988f0c654298477bd1', '6001ee988f0c654298477bd2'],
    //       members: [{ name: 'Tie glaubermman', instrument: 'Baterista' }],
    //       album: {
    //         name: 'initial-album',
    //         genre: '6001ee988f0c654298477bd1',
    //         year: 2012,
    //       },
    //       musics: [
    //         {
    //           name: '2031',
    //           genre: '6001ee988f0c654298477bd1',
    //           duration: 2020202,
    //         },
    //       ],
    //       image: 'band-image',
    //       city: 'salvador',
    //     };

    //     const firstBandResponse = await global.testRequest
    //       .post('/band')
    //       .set({ authorization: `Bearer ${token}` })
    //       .send(firstBand);

    //     const secondBandResponse = await global.testRequest
    //       .post('/band')
    //       .set({ authorization: `Bearer ${token}` })
    //       .send(secondBand);

    //     const thirdBandResponse = await global.testRequest
    //       .post('/band')
    //       .set({ authorization: `Bearer ${token}` })
    //       .send(thirdBand);

    //     await global.testRequest
    //       .post('/band/member')
    //       .set({ authorization: `Bearer ${token}` })
    //       .send({
    //         band_id: firstBandResponse.body.id,
    //         user_id: userMusician.body.user.id,
    //         memberinstrument: 'Guitarrista',
    //       });

    //     await global.testRequest
    //       .post('/band/member')
    //       .set({ authorization: `Bearer ${token}` })
    //       .send({
    //         band_id: secondBandResponse.body.id,
    //         user_id: userMusician.body.user.id,
    //         memberinstrument: 'Guitarrista',
    //       });

    //     await global.testRequest
    //       .post('/band/member')
    //       .set({ authorization: `Bearer ${token}` })
    //       .send({
    //         band_id: thirdBandResponse.body.id,
    //         user_id: userMusician.body.user.id,
    //         memberinstrument: 'Guitarrista',
    //       });

    //     const response = await global.testRequest
    //       .post('/band/member')
    //       .set({ authorization: `Bearer ${token}` })
    //       .send({
    //         band_id: thirdBandResponse.body.id,
    //         user_id: userMusician.body.user.id,
    //         memberinstrument: 'Guitarrista',
    //       });

    //     expect(response.status).toBe(400);
    //     expect(response.body).toEqual({
    //       code: 400,
    //       error: 'This user already reached the maximum bands possible',
    //     });
    //   });

    //   it('should not create a new band member on a band that is not a user musician', async () => {
    //     const defaultBand = {
    //       name: 'thirdBand',
    //       genres: ['6001ee988f0c654298477bd1', '6001ee988f0c654298477bd2'],
    //       members: [{ name: 'Tie glaubermman', instrument: 'Baterista' }],
    //       album: {
    //         name: 'initial-album',
    //         genre: '6001ee988f0c654298477bd1',
    //         year: 2012,
    //       },
    //       musics: [
    //         {
    //           name: '2031',
    //           genre: '6001ee988f0c654298477bd1',
    //           duration: 2020202,
    //         },
    //       ],
    //       image: 'band-image',
    //       city: 'salvador',
    //     };

    //     const bandResponse = await global.testRequest
    //       .post('/band')
    //       .set({ authorization: `Bearer ${token}` })
    //       .send(defaultBand);

    //     const response = await global.testRequest
    //       .post('/band/member')
    //       .set({ authorization: `Bearer ${token}` })
    //       .send({
    //         band_id: bandResponse.body.id,
    //         user_id: 'invalid-user',
    //         memberinstrument: 'Guitarrista',
    //       });

    //     expect(response.status).toBe(400);
    //     expect(response.body).toEqual({
    //       code: 400,
    //       error: 'The user must be a musician!',
    //     });
    //   });

    //   it('should not create a new band member on a band that not exists', async () => {
    //     const userMusicianDefault = {
    //       name: 'Vitor Queiroz',
    //       email: 'vitor@gmail.com',
    //       password: 'vitor123123',
    //       city: 'salvador',
    //       userMusician: {
    //         instrument: 'Baterista',
    //         musics: [
    //           {
    //             album_image: 'algum-image',
    //             album_name: 'algum-name',
    //             music_name: 'my-music',
    //             artist_name: 'artist-name',
    //             duration_ms: 2000,
    //           },
    //         ],
    //       },
    //     };

    //     const userMusician = await global.testRequest
    //       .post('/users')
    //       .send(userMusicianDefault);

    //     const response = await global.testRequest
    //       .post('/band/member')
    //       .set({ authorization: `Bearer ${token}` })
    //       .send({
    //         band_id: 'invalid-band',
    //         user_id: userMusician.body.user.id,
    //         memberinstrument: 'Guitarrista',
    //       });

    //     expect(response.status).toBe(400);
    //     expect(response.body).toEqual({
    //       code: 400,
    //       error: 'Band not found!',
    //     });
    //   });
    // });
  });
});
