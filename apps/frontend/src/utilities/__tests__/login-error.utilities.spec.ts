import { describe, expect, it } from 'vitest';
import type { AxiosError } from 'axios';
import { type LoginErrorKey, mapLoginErrorToKey } from '../login-error.utilities';

function createAxiosError(status?: number): AxiosError<unknown> {
  const error = new Error('test error') as AxiosError<unknown>;

  if (status !== undefined) {
    error.response = {
      data: {},
      status,
      statusText: 'Error',
      headers: {},
      config: {} as never,
    };
  }

  return error;
}

describe('mapLoginErrorToKey', () => {
  it('returns invalidCredentials for 401 status', () => {
    /* Arrange */
    const err = createAxiosError(401);

    /* Act */
    const key = mapLoginErrorToKey(err);

    /* Assert */
    expect(key).toBe('login.errors.invalidCredentials' satisfies LoginErrorKey);
  });

  it('returns forbidden for 403 status', () => {
    /* Arrange */
    const err = createAxiosError(403);

    /* Act */
    const key = mapLoginErrorToKey(err);

    /* Assert */
    expect(key).toBe('login.errors.forbidden' satisfies LoginErrorKey);
  });

  it('returns server for 500+ status', () => {
    /* Arrange */
    const err500 = createAxiosError(500);
    const err503 = createAxiosError(503);

    /* Assert */
    expect(mapLoginErrorToKey(err500)).toBe('login.errors.server' satisfies LoginErrorKey);
    expect(mapLoginErrorToKey(err503)).toBe('login.errors.server' satisfies LoginErrorKey);
  });

  it('returns generic when status is missing', () => {
    /* Arrange */
    const err = createAxiosError(undefined);
    const key = mapLoginErrorToKey(err);

    /* Assert */
    expect(key).toBe('login.errors.generic' satisfies LoginErrorKey);
  });

  it('returns generic for non-Axios errors', () => {
    /* Arrange */
    const plainError = new Error('plain error');
    const key = mapLoginErrorToKey(plainError);

    /* Assert */
    expect(key).toBe('login.errors.generic' satisfies LoginErrorKey);
  });
});
