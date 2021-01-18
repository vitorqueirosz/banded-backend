import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { User } from '@src/models/User';
import AuthService from '@src/services/authService';
import { BaseController } from '.';

@Controller('users')
export class UserController extends BaseController {
  @Post('')
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email, password, city } = request.body;

      const user = new User({ name, email, password, city });
      const newUser = await user.save();

      return response.status(201).json(newUser);
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
