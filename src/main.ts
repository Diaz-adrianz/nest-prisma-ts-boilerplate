import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { PrismaExceptionFilter } from './filters/prisma-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	);

	app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());

	app.use(cookieParser());

	await app.listen(3000);
}
bootstrap();
