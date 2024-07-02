import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/lib/prisma/prisma.module';
import { TokenizeModule } from 'src/lib/tokenize/tokenize.module';
import { DaoModule } from 'src/lib/dao/dao.module';

@Module({
	imports: [PrismaModule, TokenizeModule, DaoModule],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
