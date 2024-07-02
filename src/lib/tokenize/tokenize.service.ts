import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { constant } from 'src/config';

@Injectable()
export class TokenizeService {
	private issuer: string;

	constructor(private readonly jwt: JwtService) {
		this.issuer = process.env.JWT_ISSUER ?? null;
	}

	async bcryptHash(content: string): Promise<string> {
		const salt = await bcrypt.genSalt(10);

		return bcrypt.hash(content, salt);
	}

	bcryptCompare(content: string, reference: string): Promise<boolean> {
		return bcrypt.compare(content, reference);
	}

	jwtSign(payload: any, secret: string, expire?: number) {
		const options: JwtSignOptions = { secret };
		if (expire) options['expiresIn'] = expire;

		return this.jwt.signAsync({ ...payload, iss: this.issuer }, options);
	}

	jwtVerify(token: string, secret: string) {
		return this.jwt.verifyAsync(token, { secret });
	}

	verifyRefresh(token: string) {
		return this.jwtVerify(token, process.env.JWT_REFRESH_SECRET);
	}

	async createAuthTokens(atPayload: any, rtPayload?: any) {
		const [at, rt] = await Promise.all([
			this.jwtSign(atPayload, process.env.JWT_ACCESS_SECRET, constant.JWT_ACCESS_EXP),
			this.jwtSign(rtPayload ?? atPayload, process.env.JWT_REFRESH_SECRET, constant.JWT_REFRESH_EXP),
		]);

		return { at, rt };
	}
}
