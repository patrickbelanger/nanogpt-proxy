export const JWT_TYPE = {
  ACCESS: 'access',
  REFRESH: 'refresh',
} as const;

export type JwtType = (typeof JWT_TYPE)[keyof typeof JWT_TYPE];
