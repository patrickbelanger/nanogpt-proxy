import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentService } from '@nanogpt-monorepo/core';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const environmentService = app.get(EnvironmentService);

  app.use(json({ limit: '64mb' }));

  await app.listen(environmentService.proxyPort);
}

void bootstrap();
