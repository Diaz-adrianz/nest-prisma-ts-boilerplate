import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { settings } from 'src/config';

const { combine, timestamp, printf, colorize, errors } = format;

@Global()
@Module({
	imports: [
		WinstonModule.forRootAsync({
			useFactory: () => ({
				format: combine(
					timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
					errors({ stack: true }),
					colorize(),
					printf(({ level, message, timestamp, stack }) => {
						return stack ? `${timestamp} ${level}: ${message} - ${stack}` : `${timestamp} ${level}: ${message}`;
					}),
				),
				transports: [
					new transports.Console(),
					new DailyRotateFile({
						filename: settings.log.folder + settings.log.filenameError,
						level: 'error',
						datePattern: 'YYYY-MM-DD',
						zippedArchive: false,
						maxFiles: '30d',
						maxSize: '20m',
					}),
					new DailyRotateFile({
						filename: settings.log.folder + settings.log.filename,
						datePattern: 'YYYY-MM-DD',
						zippedArchive: false,
						maxFiles: '30d',
						maxSize: '20m',
					}),
				],
			}),
		}),
	],
	providers: [LoggerService],
	exports: [LoggerService],
})
export class LoggerModule {}
