import { DecodedToken } from '@src/middlewares/ensureAuthenticated';
import { User } from '@src/models/User';
import { compare, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

export default class AuthService {
  public static async hashPassword(
    password: string,
    salt = 10,
  ): Promise<string> {
    return hash(password, salt);
  }

  public static async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  public static generateToken(user: any): string {
    const token = sign({}, String(process.env.JWT_SECRET_KEY), {
      subject: String(user.id),
      expiresIn: '30d',
    });

    return token;
  }

  public static decodeToken(token: string): DecodedToken {
    return verify(token, String(process.env.JWT_SECRET_KEY)) as DecodedToken;
  }
}
