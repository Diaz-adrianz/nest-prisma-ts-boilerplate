import { Module } from '@nestjs/common';
import { DaoService } from './dao.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	providers: [DaoService],
	exports: [DaoService],
})
export class DaoModule {}
