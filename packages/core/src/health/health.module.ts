import { DynamicModule, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HEALTH_MODULE_OPTIONS, HealthModuleOptions } from './health.options';
import { RedisModule } from '../redis/redis.module';

@Module({})
export class HealthModule {
  static register(options: HealthModuleOptions): DynamicModule {
    return {
      module: HealthModule,
      imports: [TerminusModule, RedisModule],
      controllers: [HealthController],
      providers: [
        {
          provide: HEALTH_MODULE_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
