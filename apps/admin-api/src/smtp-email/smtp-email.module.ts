import { Module } from '@nestjs/common';
import { SmtpEmailService } from './smtp-email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [SmtpEmailService],
  exports: [SmtpEmailService],
})
export class SmtpEmailModule {}
