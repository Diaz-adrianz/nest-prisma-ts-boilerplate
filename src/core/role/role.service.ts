import { HttpException, HttpStatus, Injectable, UseFilters } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { DaoService } from 'src/lib/dao/dao.service';
import { BrowseDto } from 'src/helper/dto/browse.dto';
import { toPrismQuery } from 'src/utils';

@Injectable()
export class RoleService {
	constructor(
		private prisma: PrismaService,
		private dao: DaoService,
	) {}

	async create(payload: CreateRoleDto) {
		const result = await this.prisma.role.create({ data: payload });
		return result;
	}

	async findAll(query: BrowseDto) {
		const q = toPrismQuery(query);

		const [result, count] = await Promise.all([
			this.prisma.role.findMany({ ...q }),
			this.prisma.role.count({ where: q.where }),
		]);

		return { result, count };
	}

	async findOne(id: string) {
		const result = await this.prisma.role.findUnique({ where: { id } });
		if (!result) throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
		return result;
	}

	async update(id: string, payload: UpdateRoleDto) {
		const result = await this.prisma.role.update({ where: { id }, data: payload });
		return result;
	}

	async remove(ids: string[], hard: boolean = false) {
		let result: any;
		if (ids.length == 1) {
			if (hard) result = await this.dao.hardDelete('Role', ids[0]);
			else result = await this.dao.softDelete('Role', ids[0]);
		} else {
			if (hard) result = await this.dao.hardDeleteMany('Role', ids);
			else result = await this.dao.softDeleteMany('Role', ids);
		}
		return result;
	}

	async restore(ids: string[]) {
		let result: any;
		if (ids.length == 1) result = await this.dao.restore('Role', ids[0]);
		else result = await this.dao.restoreMany('Role', ids);
		return result;
	}
}
