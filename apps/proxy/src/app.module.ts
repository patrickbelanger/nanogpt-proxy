import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ForwarderModule } from './forwarder/forwarder.module';
import { HealthModule } from '@nanogpt-monorepo/core';

@Module({
  imports: [
    HealthModule.register({ serviceName: 'proxy' }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ForwarderModule,
    HealthModule,
  ],
})
export class AppModule {}
