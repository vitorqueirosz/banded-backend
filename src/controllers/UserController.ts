import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { User, UserModel } from '@src/models/User';
import AuthService from '@src/services/authService';
import multer from 'multer';
import uploadConfig from '@src/config/upload';
import { ensureAuthenticated } from '@src/middlewares/ensureAuthenticated';
import UserBandService from '@src/services/UserBandsService';
import { UserMusician } from '@src/models/UserMusician';
import { UserMusics } from '@src/models/UserMusics';
import { UserAlbums } from '@src/models/UserAlbums';
import { checkIsTheSameUser } from '@src/utils/checkIsTheSameUser';
import { getImageByPreview } from '@src/utils/getImage';
import { BaseController } from '.';

const upload = multer(uploadConfig);

type UserAlbum = {
  checkImage: string;
} & UserAlbums;
@Controller('users')
export class UserController extends BaseController {
  @Post('')
  @Middleware(upload.array('album_image'))
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email, password, city, userMusician } = request.body;

      const hashedPassword = await AuthService.hashPassword(password);
      const user = new User({ name, email, password: hashedPassword, city });
      const newUser = await user.save();

      const { bands, bandsName, musics, albums, instrument } = JSON.parse(
        userMusician,
      );

      const albumImages = request.files as Express.Multer.File[];

      const musician = await UserMusician.create({
        user: newUser._id,
        bands,
        bandsName,
        instrument,
      });

      if (albums?.length) {
        await Promise.all(
          albums.map(async (album: UserAlbum) => {
            const { album_name, year_release, checkImage } = album;

            const userAlbums = new UserAlbums({
              album_image: getImageByPreview(albumImages, checkImage),
              album_name,
              user: newUser._id,
              year_release,
            });

            await userAlbums.save();

            musician.albums.push(userAlbums);

            await Promise.all(
              album.musics.map(async (music: UserMusics) => {
                const userAlbumsMusics = new UserMusics({
                  ...music,
                  user: newUser._id,
                });

                await userAlbumsMusics.save();

                userAlbums.musics.push(userAlbumsMusics);
                musician.musics.push(userAlbumsMusics);
              }),
            );

            await userAlbums.save();
          }),
        );
      }

      if (musics?.length) {
        await Promise.all(
          musics.map(async (music: UserMusics) => {
            const userMusics = new UserMusics({
              ...music,
              user: newUser._id,
            });

            await userMusics.save();

            musician.musics.push(userMusics);
          }),
        );
      }

      await musician.save();

      const token = AuthService.generateToken(newUser.toJSON());

      return response
        .status(201)
        .json({ user: newUser, userMusician: musician, token });
    } catch (error) {
      console.log(error);
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }

  @Get('')
  @Middleware(ensureAuthenticated)
  public async index(request: Request, response: Response): Promise<Response> {
    try {
      const user_id = request.user.id;

      const userMusician = await UserMusician.findOne({
        user: user_id as any,
      }).populate('user');

      const {
        bands,
        albums,
        musics,
        instrument,
        user,
        bandsName,
      } = userMusician;

      const mergedBands = [...bands, ...bandsName];

      const { id, name, email, city } = user;

      const formattedUserResponse = {
        user: {
          id,
          name,
          email,
          city,
          bands: mergedBands.length ?? [],
          musics: musics.length ?? [],
          albums: albums.length ?? [],
          instrument,
        },
      };

      return response.json(formattedUserResponse);
    } catch (error) {
      console.log(error);
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }

  @Get('bands')
  @Middleware(ensureAuthenticated)
  public async store(request: Request, response: Response): Promise<Response> {
    try {
      const user_id = request.user.id;
      const { page, pageSize } = request.query;

      const userBandsServices = new UserBandService();

      const userBands = await userBandsServices.execute({
        user_id: String(user_id || ''),
        page: Number(page),
        pageSize: Number(pageSize),
      });

      return response.json(userBands);
    } catch (error) {
      console.log(error);
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }

  @Post('sessions')
  public async authenticate(
    request: Request,
    response: Response,
  ): Promise<Response | undefined> {
    const { email, password } = request.body;

    const user = await User.findOne({ email });

    if (!user) {
      return response.status(401).json({
        code: 401,
        error: 'User not found',
      });
    }

    if (!(await AuthService.comparePasswords(password, user.password))) {
      return response.status(401).json({
        code: 401,
        error: 'Password does not match',
      });
    }

    const token = AuthService.generateToken(user.toJSON());

    return response.status(200).send({ user: { ...user.toJSON() }, token });
  }

  @Get('search')
  @Middleware(ensureAuthenticated)
  public async search(request: Request, response: Response): Promise<Response> {
    try {
      const user_id = request.user.id;
      const { name } = request.query;

      const users: UserModel[] = await User.find({
        name: new RegExp(String(name)),
      });

      const filteredUsers = checkIsTheSameUser(users, user_id);

      const usersMusicianList: UserMusician[] = [];

      const [usersMusician] = await Promise.all(
        filteredUsers.map(async user => {
          const {
            instrument,
            user: { name, id, avatar },
          } = await UserMusician.findOne({
            user: user._id,
          }).populate('user');

          if (user) {
            const formattedUserMusician = {
              id,
              instrument,
              name,
              avatar,
            };

            usersMusicianList.push(
              (formattedUserMusician as unknown) as UserMusician,
            );
          }

          return usersMusicianList;
        }),
      );

      return response.json(usersMusician ?? []);
    } catch (error) {
      console.log(error);
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }
}
