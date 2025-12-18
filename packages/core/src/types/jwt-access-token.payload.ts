import { JWT_TYPE } from '../enums/jwt-type';

export interface JwtAccessTokenPayload {
  sub: string; // Email Address
  r: string[]; // Roles List, ex: ['admin']
  jti: string;
  type: typeof JWT_TYPE.ACCESS;
}
