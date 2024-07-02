import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PrismaModule } from 'src/lib/prisma/prisma.module';
import { DaoModule } from 'src/lib/dao/dao.module';

@Module({
	imports: [DaoModule, PrismaModule],
	controllers: [RoleController],
	providers: [RoleService],
})
export class RoleModule {}
