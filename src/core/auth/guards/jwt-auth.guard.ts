import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { constant } from 'src/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('at') {
	constructor(private reflector: Reflector) {
		super();
	}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(constant.DECORATORS.AUTH_PUBLIC, [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) return true;

		return super.canActivate(context);
	}

	handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
		if (err) throw err;

		if (!user) {
			let message = 'Access denied';
			if (info?.name == 'TokenExpiredError') message = 'Access expired';
			else if (info?.message == 'No auth token') message = 'Access is not provided';

			throw new HttpException(message, HttpStatus.UNAUTHORIZED);
		}

		return user;
	}
}
