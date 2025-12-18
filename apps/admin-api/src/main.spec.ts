import { NestFactory } from '@nestjs/core';
import { EnvironmentService } from '@nanogpt-monorepo/core';
import { bootstrap } from './main';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

const enableCors = jest.fn();
const listen = jest.fn();
const get = jest.fn();

describe('bootstrap', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    get.mockReturnValue({
      adminPort: 3001,
    } as Partial<EnvironmentService>);

    (NestFactory.create as jest.Mock).mockResolvedValue({
      enableCors,
      listen,
      get,
    } as any);
  });

  it('should create the app, configure CORS and listen on adminPort', async () => {
    /* Act */
    await bootstrap();

    /* Assert */
    expect(NestFactory.create).toHaveBeenCalled();
    expect(enableCors).toHaveBeenCalledWith(
      expect.objectContaining({
        credentials: true,
        methods: expect.arrayContaining(['GET', 'HEAD', 'POST', 'DELETE']),
        allowedHeaders: expect.arrayContaining(['Content-Type', 'Authorization']),
      }),
    );
    expect(listen).toHaveBeenCalledWith(3001);
  });
});
