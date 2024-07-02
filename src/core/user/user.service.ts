import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { TokenizeService } from 'src/lib/tokenize/tokenize.service';
import { BrowseDto } from 'src/helper/dto/browse.dto';
import { excludePrismaSelect, toPrismQuery, toPrismSelect } from 'src/utils';
import { DaoService } from 'src/lib/dao/dao.service';

@Injectable()
export class UserService {
	constructor(
		private tokenize: TokenizeService,
		private prisma: PrismaService,
		private dao: DaoService,
	) {}

	async create(payload: CreateUserDto) {
		const result = await this.prisma.user.create({
			data: {
				username: payload.username,
				email: payload.email,
				password: await this.tokenize.bcryptHash(payload.password),
				is_active: payload.is_active,
			},
		});

		return result;
	}

	async findAll(query: BrowseDto) {
		const q = toPrismQuery(query);

		const [result, count] = await Promise.all([
			this.prisma.user.findMany({
				...q,
				select: toPrismSelect([
					'id',
					'username',
					'path_photo',
					'is_active',
					'is_email_verified',
					'is_deleted',
					'created_at',
				]),
			}),
			this.prisma.user.count({ where: q.where }),
		]);

		return { result, count };
	}

	async findOne(id: string) {
		const result = await this.prisma.user.findUnique({ where: { id } });
		if (!result) throw new NotFoundException('User not found');
		return excludePrismaSelect(result, ['password']);
	}

	async update(id: string, payload: UpdateUserDto) {
		if (payload.password) {
			payload.password = await this.tokenize.bcryptHash(payload.password);
			delete payload.confirm_password;
		}

		const result = await this.prisma.user.update({
			where: { id },
			data: {
				...payload,
			},
		});

		return result;
	}

	async remove(ids: string[], hard: boolean = false) {
		let result: any;
		if (ids.length == 1) {
			if (hard) result = await this.dao.hardDelete('User', ids[0]);
			else result = await this.dao.softDelete('User', ids[0]);
		} else {
			if (hard) result = await this.dao.hardDeleteMany('User', ids);
			else result = await this.dao.softDeleteMany('User', ids);
		}
		return result;
	}

	async restore(ids: string[]) {
		let result: any;
		if (ids.length == 1) result = await this.dao.restore('User', ids[0]);
		else result = await this.dao.restoreMany('User', ids);
		return result;
	}
}
