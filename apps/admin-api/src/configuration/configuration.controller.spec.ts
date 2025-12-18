import { Test, TestingModule } from '@nestjs/testing';
import { ConfigurationController } from './configuration.controller';
import { ConfigurationService } from './configuration.service';
import { ConfigurationTypes } from './configuration.types';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

describe('ConfigurationController', () => {
  let controller: ConfigurationController;
  let configurationService: {
    getConfig: jest.Mock<Promise<ConfigurationTypes>, []>;
    updateConfig: jest.Mock<Promise<ConfigurationTypes>, [Partial<ConfigurationTypes>]>;
  };

  beforeEach(async () => {
    configurationService = {
      getConfig: jest.fn(),
      updateConfig: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigurationController],
      providers: [
        {
          provide: ConfigurationService,
          useValue: configurationService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<ConfigurationController>(ConfigurationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call configurationService.getConfig on GET', async () => {
    /* Arrange */
    const fakeConfig: ConfigurationTypes = {
      forgetPassword: false,
      registration: true,
      reviewPendingRegistration: false,
    };

    configurationService.getConfig.mockResolvedValue(fakeConfig);

    /* Act */
    const result = await controller.getConfig();

    /* Assert */
    expect(configurationService.getConfig).toHaveBeenCalledTimes(1);
    expect(result).toEqual(fakeConfig);
  });

  it('should call configurationService.updateConfig on PUT', async () => {
    /* Arrange */
    const partial: Partial<ConfigurationTypes> = { registration: false };
    const updated: ConfigurationTypes = {
      forgetPassword: false,
      registration: false,
      reviewPendingRegistration: true,
    };

    configurationService.updateConfig.mockResolvedValue(updated);

    /* Act */
    const result = await controller.updateConfig(partial);

    /* Assert */
    expect(configurationService.updateConfig).toHaveBeenCalledWith(partial);
    expect(result).toEqual(updated);
  });
});
