import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { User } from '@src/models/User';
import AuthService from '@src/services/authService';
import { ensureAuthenticated } from '@src/middlewares/ensureAuthenticated';
import UserBandService from '@src/services/UserBandsService';
import { UserMusician } from '@src/models/UserMusician';
import { UserMusics } from '@src/models/UserMusics';
import { BaseController } from '.';

@Controller('users')
export class UserController extends BaseController {
  @Post('')
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email, password, city, userMusician } = request.body;

      const user = new User({ name, email, password, city });
      const newUser = await user.save();

      if (userMusician) {
        const { bands, bandsName, musics } = userMusician;

        const musician = await UserMusician.create({
          bands,
          bandsName,
          function: userMusician.function,
        });

        await Promise.all(
          musics.map(async (music: UserMusics) => {
            const userMusics = new UserMusics({ ...music, user: musician._id });

            await userMusics.save();

            musician.musics.push(userMusics);
          }),
        );

        await musician.save();

        return response
          .status(201)
          .json({ user: newUser, userMusician: musician });
      }

      return response.status(201).json(newUser);
    } catch (error) {
      return this.sendCreatedUpdateErrorResponse(response, request, error);
    }
  }

  @Get('')
  @Middleware(ensureAuthenticated)
  public async index(request: Request, response: Response): Promise<Response> {
    try {
      const user_id = request.user.id;

      const user = await User.findOne({ _id: user_id });

      const userBandsServices = new UserBandService();

      const userBands = await userBandsServices.execute({
        user_id,
      });

      return response.json({ user, bands: userBands });
    } catch (error) {
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

    // eslint-disable-next-line consistent-return
    return response.status(200).send({ ...user.toJSON(), token });
  }
}
