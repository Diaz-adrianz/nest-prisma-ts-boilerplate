import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { settings } from 'src/config';
import { LoggerService } from 'src/lib/logger/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerService) {}

	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp(),
			response = ctx.getResponse<Response>(),
			status = exception.getStatus(),
			message = exception.getResponse()['message'] ?? exception.getResponse(),
			stack = exception.stack;

		if (!settings.isDev()) this.logger.error(exception);

		response.status(status).json({
			statusCode: status,
			message,
			stack: settings.isDev() ? stack : undefined,
		});
	}
}
