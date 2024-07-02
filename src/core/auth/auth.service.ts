import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { TokenizeService } from 'src/lib/tokenize/tokenize.service';
import { LoginDto } from './dto/login.dto';
import { excludePrismaSelect, genRandomString } from 'src/utils';
import { constant } from 'src/config';
import { ClientService } from 'src/lib/client/client.service';
import { TjwtPayload, TuserAuth } from 'src/types';
import { RedisService } from 'src/lib/redis/redis.service';
import { RegisterDto } from './dto/register.dto';
import { MailerService } from 'src/lib/mailer/mailer.service';

@Injectable()
export class AuthService {
	constructor(
		private redis: RedisService,
		private prisma: PrismaService,
		private tokenize: TokenizeService,
		private client: ClientService,
		private mailer: MailerService,
	) {}

	async register(payload: RegisterDto) {
		// insert to database
		const newUser = await this.prisma.user.create({
			data: {
				username: payload.username,
				email: payload.email,
				password: await this.tokenize.bcryptHash(payload.password),
			},
		});

		try {
			// generate token and redirect link
			// TODO update link with page url in client domain
			const token = await this.tokenize.jwtSign({ uid: newUser.id }, process.env.JWT_VERIF_EMAIL_SECRET),
				link = `${process.env.URL_SERVER}/auth/email-verification?token=${token}`;

			// send verification to email inbox
			await this.mailer.sendEmailVerification(payload.username, payload.email, link);
		} catch (error) {
			// TODO store error in logger
			console.log('send email verification error', error);
		}
	}

	async login(payload: LoginDto) {
		const user = await this.prisma.user.findUnique({ where: { username: payload.username } });

		// user must exist
		if (!user) throw new HttpException('Account not found', HttpStatus.NOT_FOUND);

		// user email must be verified
		if (!user.is_email_verified) throw new HttpException('Email not verified yet', HttpStatus.FORBIDDEN);

		// user must active
		if (!user.is_active) throw new HttpException('Account is currently inactive', HttpStatus.FORBIDDEN);

		// password must be match
		if (!(await this.tokenize.bcryptCompare(payload.password, user.password)))
			throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);

		// generate session id
		const sessionId = genRandomString(24);

		// generate access token and refresh token
		const { at, rt } = await this.tokenize.createAuthTokens({ sid: sessionId });

		// store tokens in redis
		const { id, username, email } = user,
			clientInfo = this.client.getInfo(),
			value = JSON.stringify({ id, username, email, client: clientInfo } as TuserAuth);

		this.redis.cl.setex(`access:${sessionId}`, constant.JWT_ACCESS_EXP, value);
		this.redis.cl.setex(`refresh:${sessionId}`, constant.JWT_REFRESH_EXP, value);

		return { user: excludePrismaSelect(user, ['password']), at, rt };
	}

	async logout() {
		try {
			// get session id
			const sessionId = this.client.getSessionId();

			// delete tokens in redis
			await this.redis.cl.del(`access:${sessionId}`);
			await this.redis.cl.del(`refresh:${sessionId}`);
		} catch (error) {
			throw new HttpException('Failed to logout', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async refreshToken() {
		const refreshToken = this.client.getRefreshToken();
		if (!refreshToken) throw new HttpException('Access denied', HttpStatus.UNAUTHORIZED);

		try {
			// verify signature refresh token
			const { sid: sessionId } = (await this.tokenize.verifyRefresh(refreshToken)) as TjwtPayload;

			// refresh with session id must exist in redis
			const refreshValue = await this.redis.cl.get(`refresh:${sessionId}`);
			if (!refreshValue) throw null;

			// generate new access token
			const { at } = await this.tokenize.createAuthTokens({ sid: sessionId });

			// store new access token in redis
			const data = JSON.parse(refreshValue) as TuserAuth,
				clientInfo = this.client.getInfo(),
				value = { ...data, client: clientInfo } as TuserAuth;

			this.redis.cl.setex(`access:${sessionId}`, constant.JWT_ACCESS_EXP, JSON.stringify(value));

			return { at };
		} catch (error) {
			// TODO catch another errors
			// TODO store error in logger
			throw new HttpException('Access denied', HttpStatus.UNAUTHORIZED);
		}
	}

	async verifyEmail(token: string) {
		try {
			// verify access token
			const payload = await this.tokenize.jwtVerify(token, process.env.JWT_VERIF_EMAIL_SECRET);

			// user must not be verified yet
			const checkUser = await this.prisma.user.count({ where: { id: payload.uid, is_email_verified: true } });
			if (checkUser) throw new HttpException("Account's email has been verified", HttpStatus.BAD_REQUEST);

			// set email verified and active
			await this.prisma.user.update({
				where: { id: payload.uid },
				data: {
					is_email_verified: true,
					is_active: true,
				},
			});
		} catch (error) {
			// access token related errors
			if (error?.message == 'jwt must be provided')
				throw new HttpException('Access not provided', HttpStatus.BAD_REQUEST);
			if (error?.message == 'invalid signature') throw new HttpException('Invalid access', HttpStatus.BAD_REQUEST);

			throw error;
		}
	}
}
