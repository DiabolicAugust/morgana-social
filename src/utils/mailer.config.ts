import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import { getAccessToken } from './google-auth.service'; // Adjust the path as needed

export async function createMailerConfig(): Promise<MailerOptions> {
  // const accessToken = await getAccessToken();

  return {
    transport: {
      // service: 'gmail',
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'horace.walker@ethereal.email',
        pass: 'WyjXts65bNnhSB4wBA',
      },
      // auth: {

      // type: 'OAuth2',
      // user: 'mailermorgana@gmail.com',
      // clientId: process.env.GOOGLE_CLIENT_ID,
      // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      // accessToken: accessToken,
      // },
    },
    defaults: {
      from: '"No Reply" <no-reply@localhost>',
    },

    // template: {
    //   dir: path.join(__dirname, '..', 'template'),
    //   adapter: new HandlebarsAdapter(),
    //   options: {
    //     strict: true,
    //   },
    // },
  };
}
