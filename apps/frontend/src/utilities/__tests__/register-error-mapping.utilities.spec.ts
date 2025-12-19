import { describe, it, expect } from 'vitest';
import {
  mapRegisterErrorToKey,
  type RegisterErrorMessageKey,
} from '../register-error-mapping.utilities';

type AxiosErrorLike = {
  response?: {
    status?: number;
  };
};

function createAxiosError(status?: number): AxiosErrorLike {
  return status !== undefined ? { response: { status } } : {};
}

describe('mapRegisterErrorToKey', () => {
  it('returns conflict key for 409 without revealing the account exists', () => {
    /* Arrange */
    const error = createAxiosError(409);

    /* Act */
    const key = mapRegisterErrorToKey(error);

    /* Assert */
    expect(key).toBe<RegisterErrorMessageKey>('register.errors.conflict');
  });

  it('returns forbidden key for 403', () => {
    /* Arrange */
    const error = createAxiosError(403);

    /* Act */
    const key = mapRegisterErrorToKey(error);

    /* Assert */
    expect(key).toBe('register.errors.forbidden');
  });

  it('returns server key for 500-range errors', () => {
    /* Arrange */
    const error500 = createAxiosError(500);
    const error503 = createAxiosError(503);

    /* Assert */
    expect(mapRegisterErrorToKey(error500)).toBe('register.errors.server');
    expect(mapRegisterErrorToKey(error503)).toBe('register.errors.server');
  });

  it('returns generic key for 400-ish validation errors', () => {
    /* Arrange */
    const error400 = createAxiosError(400);
    const error422 = createAxiosError(422);

    /* Assert */
    expect(mapRegisterErrorToKey(error400)).toBe('register.errors.generic');
    expect(mapRegisterErrorToKey(error422)).toBe('register.errors.generic');
  });

  it('returns generic key when there is no response or status', () => {
    /* Arrange */
    const plainError = new Error('Something went wrong');
    const noStatusError = { response: {} };

    /* Assert */
    expect(mapRegisterErrorToKey(plainError)).toBe('register.errors.generic');
    expect(mapRegisterErrorToKey(noStatusError)).toBe('register.errors.generic');
  });
});
