import { JWT_TYPE } from '@nanogpt-monorepo/core/dist/enums/jwt-type';

export type JwtDecodedPayload = {
  sub?: string;
  r?: string[];
  jti?: string;
  type?: typeof JWT_TYPE.ACCESS | typeof JWT_TYPE.REFRESH;
  exp?: number;
};
