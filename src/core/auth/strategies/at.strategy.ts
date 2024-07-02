import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TjwtPayload } from 'src/types';
import { RedisService } from 'src/lib/redis/redis.service';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'at') {
	constructor(private redis: RedisService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_ACCESS_SECRET,
		});
	}

	async validate(payload: TjwtPayload) {
		const user = await this.redis.cl.get(`access:${payload.sid}`);
		if (!user) throw new HttpException('Access denied', HttpStatus.UNAUTHORIZED);

		return { sessionId: payload.sid, user: JSON.parse(user) };
	}
}
