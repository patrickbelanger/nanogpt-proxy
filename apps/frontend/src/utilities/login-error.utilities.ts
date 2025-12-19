import type { AxiosError } from 'axios';

export type LoginErrorKey =
  | 'login.errors.invalidCredentials'
  | 'login.errors.forbidden'
  | 'login.errors.server'
  | 'login.errors.generic';

export function mapLoginErrorToKey(error: unknown): LoginErrorKey {
  const axiosError = error as AxiosError<unknown> | undefined;
  const status = axiosError?.response?.status;

  if (status === 401) {
    return 'login.errors.invalidCredentials';
  }

  if (status === 403) {
    return 'login.errors.forbidden';
  }

  if (typeof status === 'number' && status >= 500) {
    return 'login.errors.server';
  }

  return 'login.errors.generic';
}
