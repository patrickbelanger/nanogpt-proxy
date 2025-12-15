import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {
  CryptoModule,
  EnvironmentModule,
  RedisModule,
  UserRepository,
} from '@nanogpt-monorepo/core';
import { SecurityModule } from '../security/security.module';
import { UsersService } from '../users/users.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { ConfigurationRepository } from '../configuration/configuration.repository';

@Module({
  imports: [EnvironmentModule, CryptoModule, RedisModule, SecurityModule],
  providers: [
    AuthService,
    ConfigurationRepository,
    ConfigurationService,
    UserRepository,
    UsersService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
