import AuthService from '@src/services/authService';
import { ensureAuthenticated } from '../ensureAuthenticated';

describe('Authmiddleware', () => {
  it('should verify a JWT token and call the next middleware', () => {
    const jwtToken = AuthService.generateToken({ data: 'fake' });

    const requestFake = {
      headers: {
        'x-access-token': jwtToken,
      },
    };

    const responseFake = {};

    const nextFake = jest.fn();

    ensureAuthenticated(requestFake, responseFake, nextFake);

    expect(nextFake).toHaveBeenCalled();
  });

  it('should return UNAUTHORIZED if there is a problem on the token verification', () => {
    const reqFake = {
      headers: {
        'x-access-token': 'invalid token',
      },
    };
    const sendMock = jest.fn();
    const resFake = {
      status: jest.fn(() => ({
        json: sendMock,
      })),
    };
    const nextFake = jest.fn();
    ensureAuthenticated(reqFake, resFake as any, nextFake);
    expect(resFake.status).toHaveBeenCalledWith(401);
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt malformed',
    });
  });

  it('should return ANAUTHORIZED middleware if theres no token', () => {
    const reqFake = {
      headers: {},
    };
    const sendMock = jest.fn();
    const resFake = {
      status: jest.fn(() => ({
        json: sendMock,
      })),
    };
    const nextFake = jest.fn();
    ensureAuthenticated(reqFake, resFake as any, nextFake);
    expect(resFake.status).toHaveBeenCalledWith(401);
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt must be provided',
    });
  });
});
