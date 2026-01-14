import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SmtpEmailService {
  private readonly logger = new Logger(SmtpEmailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly fromAddress: string;
  private readonly fromName: string;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST');
    const port = this.config.get<number>('SMTP_PORT');
    const secure = this.config.get<string>('SMTP_SECURE') === 'true';
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASSWORD');

    if (!host || !port || !user || !pass) {
      this.logger.warn('SMTP is not fully configured (missing host/port/user/pass)');
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    });

    this.fromAddress = this.config.get<string>('EMAIL_FROM_ADDRESS') ?? 'no-reply@example.com';
    this.fromName = this.config.get<string>('EMAIL_FROM_NAME') ?? 'NanoGPT Admin';
  }

  async sendPasswordResetEmail(toEmail: string, resetUrl: string): Promise<void> {
    const subject = 'Reset your NanoGPT password';
    const html = `
      <p>You requested to reset your NanoGPT password.</p>
      <p>Click the button below to choose a new password:</p>
      <p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:10px 18px;background:#111;color:#fff;text-decoration:none;border-radius:4px;">
          Reset password
        </a>
      </p>
      <p>If you did not request this, you can safely ignore this email.</p>
      <p>This link will expire in 30 minutes.</p>
    `;

    const text = `
You requested to reset your NanoGPT password.

Open this link to reset it:
${resetUrl}

If you did not request this, you can ignore this email.
This link expires in 30 minutes.
`;

    try {
      await this.transporter.sendMail({
        from: `"${this.fromName}" <${this.fromAddress}>`,
        to: toEmail,
        subject,
        html,
        text,
      });
    } catch (error) {
      this.logger.error('Failed to send password reset email', error as Error);
      throw error;
    }
  }
}
