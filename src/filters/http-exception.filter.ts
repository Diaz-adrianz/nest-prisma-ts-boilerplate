import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { settings } from 'src/config';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp(),
			response = ctx.getResponse<Response>(),
			status = exception.getStatus(),
			message = exception.getResponse()['message'] ?? exception.getResponse(),
			stack = exception.stack;

		response.status(status).json({
			statusCode: status,
			message,
			stack: settings.isDev() ? stack : undefined,
		});
	}
}
