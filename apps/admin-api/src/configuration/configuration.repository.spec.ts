import { Test, TestingModule } from '@nestjs/testing';
import { ConfigurationRepository } from './configuration.repository';
import { RedisService } from '@nanogpt-monorepo/core';
import { ConfigurationTypes, DEFAULT_NANOGPT_CONFIG } from './configuration.types';

const FEATURES_KEY = 'config:nanogpt:features';

function makeRedisMock() {
  return {
    getHash: jest.fn<Promise<Record<string, string> | null>, [string]>(),
    setHash: jest.fn<Promise<void>, [string, Record<string, string>]>(),
  };
}

describe('ConfigurationRepository', () => {
  let repo: ConfigurationRepository;
  let redis: ReturnType<typeof makeRedisMock>;

  beforeEach(async () => {
    redis = makeRedisMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigurationRepository,
        {
          provide: RedisService,
          useValue: redis,
        },
      ],
    }).compile();

    repo = module.get(ConfigurationRepository);
    jest.clearAllMocks();
  });

  it('should return default config when Redis hash is missing', async () => {
    /* Arrange */
    redis.getHash.mockResolvedValue(null);

    /* Act */
    const result = await repo.getConfig();

    /* Assert */
    expect(redis.getHash).toHaveBeenCalledWith(FEATURES_KEY);
    expect(result).toEqual(DEFAULT_NANOGPT_CONFIG);
  });

  it('should map stored hash to typed config using boolean parsing', async () => {
    /* Arrange */
    redis.getHash.mockResolvedValue({
      /* Validating all "parse" branches */
      enableForgetPassword: 'TrUe',
      enableRegistration: '0',
      enableReviewPendingRegistration: 'not-a-bool',
    });

    /* Act */
    const result = await repo.getConfig();

    /* Assert */
    expect(result.forgetPassword).toBe(true);
    expect(result.registration).toBe(false);
    expect(result.reviewPendingRegistration).toBe(DEFAULT_NANOGPT_CONFIG.reviewPendingRegistration);
  });

  it('should merge partial config with current config and persist as hash', async () => {
    /* Arrange */
    const current: ConfigurationTypes = {
      forgetPassword: false,
      registration: false,
      reviewPendingRegistration: false,
    };

    redis.getHash.mockResolvedValue({
      enableForgetPassword: String(current.forgetPassword),
      enableRegistration: String(current.registration),
      enableReviewPendingRegistration: String(current.reviewPendingRegistration),
    });

    redis.setHash.mockResolvedValue();

    const partial: Partial<ConfigurationTypes> = {
      registration: true,
      reviewPendingRegistration: true,
    };

    /* Act */
    const result = await repo.saveConfig(partial);

    /* Assert */
    expect(redis.getHash).toHaveBeenCalledWith(FEATURES_KEY);
    expect(redis.setHash).toHaveBeenCalledWith(FEATURES_KEY, {
      enableForgetPassword: 'false',
      enableRegistration: 'true',
      enableReviewPendingRegistration: 'true',
    });

    expect(result).toEqual<ConfigurationTypes>({
      forgetPassword: false,
      registration: true,
      reviewPendingRegistration: true,
    });
  });
});
