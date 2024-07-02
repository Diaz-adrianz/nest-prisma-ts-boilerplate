import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService as MailerServ } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
	constructor(private mailer: MailerServ) {}

	send(options: ISendMailOptions) {
		return this.mailer.sendMail(options);
	}

	sendEmailVerification(username: string, email: string, link: string) {
		return this.send({
			to: email,
			subject: 'Welcome to The Choco App!',
			template: './email-verification',
			context: {
				username,
				link,
				greeter: 'Chocoding team',
			},
		});
	}
}
