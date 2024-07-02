import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
	catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = 'Internal server error';

		if (exception.code === 'P2002') {
			status = HttpStatus.CONFLICT;
			message = exception.meta?.target ? `The ${exception.meta.target} is already taken` : 'Duplicate entry';
		} else if (exception.code == 'P2025') {
			status = HttpStatus.NOT_FOUND;
			message = `${exception.meta?.modelName ?? 'Data'} not found`;
		}

		response.status(status).json({
			statusCode: status,
			message,
		});
	}
}
