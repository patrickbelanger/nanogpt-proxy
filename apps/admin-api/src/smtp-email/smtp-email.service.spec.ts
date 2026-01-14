import { Test, TestingModule } from '@nestjs/testing';
import { SmtpEmailService } from './smtp-email.service';
import { ConfigModule } from '@nestjs/config';

describe('SmtpEmailService', () => {
  let service: SmtpEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [SmtpEmailService],
    }).compile();

    service = module.get<SmtpEmailService>(SmtpEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
