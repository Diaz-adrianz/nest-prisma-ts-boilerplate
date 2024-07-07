import { Module } from '@nestjs/common';
import { RoleModule } from './core/role/role.module';
import { UserModule } from './core/user/user.module';
import { AuthModule } from './core/auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './core/auth/guards/jwt-auth.guard';
import { LoggerModule } from './lib/logger/logger.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { PrismaExceptionFilter } from './filters/prisma-exception.filter';
import { UploaderModule } from './core/uploader/uploader.module';

@Module({
	imports: [UserModule, RoleModule, AuthModule, UploaderModule, LoggerModule],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
		{
			provide: APP_FILTER,
			useClass: PrismaExceptionFilter,
		},
	],
})
export class AppModule {}
