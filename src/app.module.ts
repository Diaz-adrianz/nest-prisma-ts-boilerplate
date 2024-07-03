import { Module } from '@nestjs/common';
import { RoleModule } from './core/role/role.module';
import { UserModule } from './core/user/user.module';
import { AuthModule } from './core/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './core/auth/guards/jwt-auth.guard';
import { LoggerModule } from './lib/logger/logger.module';

@Module({
	imports: [UserModule, RoleModule, AuthModule, LoggerModule],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule {}
