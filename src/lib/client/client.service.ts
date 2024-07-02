import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { constant } from 'src/config';
import { TclientInfo, TuserAuth } from 'src/types';
import * as useragent from 'useragent';

@Injectable({
	scope: Scope.REQUEST,
})
export class ClientService {
	constructor(@Inject(REQUEST) private readonly req: Request) {}

	getInfo(): TclientInfo {
		const clientIp = this.req.ip,
			userAgent = useragent.parse(this.req.headers['user-agent']);

		return {
			ip: clientIp,
			device: userAgent.device.toString(),
			browser: userAgent.toAgent(),
			os: userAgent.os.toString(),
		};
	}

	getUser(): TuserAuth | null {
		const reqUser = this.req.user as any;
		return (reqUser.user as TuserAuth) ?? null;
	}

	getSessionId(): string | null {
		const reqUser = this.req.user as any;
		return reqUser.sessionId ?? null;
	}

	getRefreshToken(): string | null {
		return this.req.cookies[constant.RT_KEY_IN_COOKIE] ?? null;
	}
}
