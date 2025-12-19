import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AxiosInstance } from 'axios';
import axios from 'axios';

vi.mock('../../utilities/cookies.utilities', () => ({
  getAccessToken: vi.fn(),
  getRefreshToken: vi.fn(),
  setAuthCookies: vi.fn(),
  clearAuthCookies: vi.fn(),
}));

type Mock = ReturnType<typeof vi.fn>;

let api: AxiosInstance;
let getAccessTokenMock: Mock;
let getRefreshTokenMock: Mock;
let setAuthCookiesMock: Mock;
let clearAuthCookiesMock: Mock;

function getRequestInterceptor(apiInstance: AxiosInstance) {
  const anyApi = apiInstance as any;
  const handler = anyApi.interceptors.request.handlers[0]?.fulfilled;
  if (!handler) {
    throw new Error('No request interceptor found');
  }
  return handler as (config: any) => any;
}

function getResponseRejectedInterceptor(apiInstance: AxiosInstance) {
  const anyApi = apiInstance as any;
  const handler = anyApi.interceptors.response.handlers[0]?.rejected;
  if (!handler) {
    throw new Error('No response rejected interceptor found');
  }
  return handler as (error: any) => Promise<any>;
}

beforeEach(async () => {
  vi.resetModules();
  vi.restoreAllMocks();

  const mod = await import('../axios-client');
  api = mod.api;

  const cookies = await import('../../utilities/cookies.utilities');
  getAccessTokenMock = cookies.getAccessToken as unknown as Mock;
  getRefreshTokenMock = cookies.getRefreshToken as unknown as Mock;
  setAuthCookiesMock = cookies.setAuthCookies as unknown as Mock;
  clearAuthCookiesMock = cookies.clearAuthCookies as unknown as Mock;

  (api.defaults as any).adapter = vi.fn(async (config: any) => ({
    data: { ok: true },
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  }));
});

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('axios api client', () => {
  it('adds Authorization header when access token exists', () => {
    /* Arrange */
    getAccessTokenMock.mockReturnValue('access-123');

    /* Act */
    const requestInterceptor = getRequestInterceptor(api);

    const config = requestInterceptor({ headers: {} });

    /* Assert */
    expect(config.headers.Authorization).toBe('Bearer access-123');
  });

  it('does not add Authorization header when access token is missing', () => {
    /* Arrange */
    getAccessTokenMock.mockReturnValue(null);

    /* Act */
    const requestInterceptor = getRequestInterceptor(api);

    const config = requestInterceptor({ headers: {} });

    /* Assert */
    expect(config.headers.Authorization).toBeUndefined();
  });

  it('response interceptor – returns rejected promise when there is no response', async () => {
    /* Act */
    const responseRejected = getResponseRejectedInterceptor(api);

    const error: any = new Error('Network error');
    error.config = {};

    /* Assert */
    await expect(responseRejected(error)).rejects.toBe(error);
  });

  it('response interceptor – rejects when status is not 401', async () => {
    /* Act */
    const responseRejected = getResponseRejectedInterceptor(api);

    getRefreshTokenMock.mockReturnValue('some-refresh');

    const error = {
      response: { status: 403 },
      config: {},
    };

    /* Assert */
    await expect(responseRejected(error as any)).rejects.toEqual(error);
  });

  it('response interceptor – rejects when no refresh token is available (pre-check)', async () => {
    /* Act */
    const responseRejected = getResponseRejectedInterceptor(api);

    getRefreshTokenMock.mockReturnValue(null);

    const error = {
      response: { status: 401 },
      config: {},
    };

    /* Assert */
    await expect(responseRejected(error as any)).rejects.toEqual(error);
    expect(clearAuthCookiesMock).not.toHaveBeenCalled();
  });

  it('response interceptor – performs refresh and retries request on 401', async () => {
    /* Arrange */
    const responseRejected = getResponseRejectedInterceptor(api);

    getRefreshTokenMock.mockReturnValue('valid-refresh');

    const postSpy = vi.spyOn(axios, 'post').mockResolvedValue({
      data: {
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
      },
    } as any);

    const error = {
      response: { status: 401 },
      config: { url: '/protected', headers: {} },
    };

    /* Act */
    const result = await responseRejected(error as any);

    /* Assert */
    const adapterMock = (api.defaults as any).adapter as Mock;
    expect(adapterMock).toHaveBeenCalledTimes(1);

    expect(postSpy).toHaveBeenCalledWith(expect.stringMatching(/\/v1\/auth\/refresh\/$/), null, {
      withCredentials: true,
      headers: { 'x-refresh-token': 'valid-refresh' },
    });

    expect(setAuthCookiesMock).toHaveBeenCalledWith({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    });

    expect(result.data).toEqual({ ok: true });
    expect(result.status).toBe(200);
    expect(result.statusText).toBe('OK');
    expect(result.config).toBeDefined();
  });

  it('response interceptor – clears cookies and redirects when refresh fails', async () => {
    /* Arrange */
    const responseRejected = getResponseRejectedInterceptor(api);

    getRefreshTokenMock.mockReturnValue('refresh-token');

    vi.spyOn(axios, 'post').mockRejectedValue(new Error('Refresh failed'));

    const error = {
      response: { status: 401 },
      config: {},
    };

    /* Act */
    await expect(responseRejected(error as any)).rejects.toThrow('Refresh failed');

    /* Assert */
    expect(clearAuthCookiesMock).toHaveBeenCalledTimes(1);
  });

  it('queues requests when refresh is already in progress and retries them with new token', async () => {
    /* Arrange */
    const responseRejected = getResponseRejectedInterceptor(api);

    getRefreshTokenMock.mockReturnValue('refresh-token');

    let resolveRefresh: (() => void) | undefined;

    vi.spyOn(axios, 'post').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRefresh = () =>
            resolve({
              data: {
                accessToken: 'new-access',
                refreshToken: 'new-refresh',
              },
            } as any);
        }),
    );

    const error1 = {
      response: { status: 401 },
      config: { url: '/first', headers: {} },
    };
    const error2 = {
      response: { status: 401 },
      config: { url: '/second', headers: {} },
    };

    const p1 = responseRejected(error1 as any);
    const p2 = responseRejected(error2 as any);

    resolveRefresh && resolveRefresh();

    /* Act */
    await Promise.all([p1, p2]);

    /* Assert */
    const adapterMock = (api.defaults as any).adapter as Mock;
    expect(adapterMock).toHaveBeenCalledTimes(2);
  });
});
