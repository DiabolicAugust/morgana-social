import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    email: string,
    text: string,
    subject: string | null = 'Password Reset Request',
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: subject,
      text: text,
    });
  }
}
