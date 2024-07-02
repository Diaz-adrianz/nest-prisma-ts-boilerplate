import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RedisModule } from 'src/lib/redis/redis.module';
import { ClientModule } from 'src/lib/client/client.module';
import { TokenizeModule } from 'src/lib/tokenize/tokenize.module';
import { PrismaModule } from 'src/lib/prisma/prisma.module';
import { AtStrategy } from './strategies/at.strategy';
import { MailerModule } from 'src/lib/mailer/mailer.module';

@Module({
	imports: [MailerModule, PrismaModule, RedisModule, ClientModule, TokenizeModule],
	controllers: [AuthController],
	providers: [AuthService, AtStrategy],
})
export class AuthModule {}
