import { JWT_TYPE } from '../enums/jwt-type';

export interface JwtRefreshTokenPayload {
  sub: string;
  jti: string;
  type: typeof JWT_TYPE.REFRESH;
}
