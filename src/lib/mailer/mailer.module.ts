import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerModule as MailerMod } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
	imports: [
		MailerMod.forRoot({
			transport: {
				host: process.env.MAILER_HOST,
				port: +process.env.MAILER_PORT,
				auth: {
					user: process.env.MAILER_USER,
					pass: process.env.MAILER_PASSWORD,
				},
			},
			defaults: {
				from: process.env.MAILER_FROM,
			},
			template: {
				dir: join(__dirname + '/../../templates'), // src/templates
				adapter: new HandlebarsAdapter(),
				options: {
					strict: true,
				},
			},
		}),
	],
	providers: [MailerService],
	exports: [MailerService],
})
export class MailerModule {}
