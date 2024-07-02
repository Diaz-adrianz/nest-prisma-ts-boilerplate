import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DaoService {
	constructor(private prisma: PrismaService) {}

	createOne(tbl: Prisma.ModelName, data: any) {
		return this.prisma[tbl].create({ data });
	}

	softDelete(tbl: Prisma.ModelName, id: any) {
		return this.prisma[tbl].update({ where: { id }, data: { is_deleted: true, deleted_at: new Date().toISOString() } });
	}

	softDeleteMany(tbl: Prisma.ModelName, ids: any[]) {
		return this.prisma[tbl].updateMany({
			where: { id: { in: ids } },
			data: { is_deleted: true, deleted_at: new Date().toISOString() },
		});
	}

	restore(tbl: Prisma.ModelName, id: any) {
		return this.prisma[tbl].update({ where: { id }, data: { is_deleted: false, deleted_at: null } });
	}

	restoreMany(tbl: Prisma.ModelName, ids: any[]) {
		return this.prisma[tbl].updateMany({ where: { id: { in: ids } }, data: { is_deleted: false, deleted_at: null } });
	}

	hardDelete(tbl: Prisma.ModelName, id: any) {
		return this.prisma[tbl].delete({ where: { id } });
	}

	hardDeleteMany(tbl: Prisma.ModelName, ids: any[]) {
		return this.prisma[tbl].deleteMany({ where: { id: { in: ids } } });
	}
}
