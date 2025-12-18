import { Test, TestingModule } from '@nestjs/testing';
import { ConfigurationService } from './configuration.service';
import { ConfigurationRepository } from './configuration.repository';
import { ConfigurationTypes } from './configuration.types';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let repo: {
    getConfig: jest.Mock<Promise<ConfigurationTypes>, []>;
    saveConfig: jest.Mock<Promise<ConfigurationTypes>, [Partial<ConfigurationTypes>]>;
  };

  beforeEach(async () => {
    repo = {
      getConfig: jest.fn(),
      saveConfig: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigurationService,
        {
          provide: ConfigurationRepository,
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<ConfigurationService>(ConfigurationService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getConfig should delegate to repository.getConfig and return the value', async () => {
    /* Arrange */
    const config: ConfigurationTypes = {
      forgetPassword: true,
      registration: true,
      reviewPendingRegistration: false,
    };
    repo.getConfig.mockResolvedValue(config);

    /* Act */
    const result = await service.getConfig();

    /* Assert */
    expect(repo.getConfig).toHaveBeenCalledTimes(1);
    expect(result).toEqual(config);
  });

  it('updateConfig should delegate to repository.saveConfig with partial config and return the value', async () => {
    /* Arrange */
    const partial: Partial<ConfigurationTypes> = {
      registration: false,
    };

    const updated: ConfigurationTypes = {
      forgetPassword: true,
      registration: false,
      reviewPendingRegistration: true,
    };

    repo.saveConfig.mockResolvedValue(updated);

    /* Act */
    const result = await service.updateConfig(partial);

    /* Assert */
    expect(repo.saveConfig).toHaveBeenCalledTimes(1);
    expect(repo.saveConfig).toHaveBeenCalledWith(partial);
    expect(result).toEqual(updated);
  });
});
