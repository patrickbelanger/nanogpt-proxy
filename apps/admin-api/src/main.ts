import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentService } from '@nanogpt-monorepo/core';
import { Logger } from '@nestjs/common';

export async function bootstrap(): Promise<void> {
  const logger = new Logger('CORS');

  const app = await NestFactory.create(AppModule);
  const fallbackOrigins = ['http://localhost:5173'];
  const corsOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const allowedOrigins = corsOrigins.length ? corsOrigins : fallbackOrigins;

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      logger.log(`Allowed origins: ${allowedOrigins.join(', ')}`);

      if (!allowedOrigins.includes(origin)) {
        logger.warn(`BLOCKED origin="${origin}" allowed="${allowedOrigins.join(', ')}"`);
        return callback(new Error(`CORS blocked for origin: ${origin}`), false);
      }
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const environmentService = app.get(EnvironmentService);
  await app.listen(environmentService.adminPort);
}

if (process.env.NODE_ENV !== 'test') {
  void bootstrap();
}
