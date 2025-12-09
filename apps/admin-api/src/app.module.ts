import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { SecurityModule } from './security/security.module';
import { HealthModule } from '@nanogpt-monorepo/core';

@Module({
  imports: [
    HealthModule.register({ serviceName: 'admin-api' }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    SecurityModule,
    HealthModule,
  ],
})
export class AppModule {}
