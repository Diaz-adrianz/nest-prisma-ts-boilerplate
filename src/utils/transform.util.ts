import { isBoolean, isNumber } from 'class-validator';
import { BrowseDto } from 'src/helper/dto/browse.dto';
import { transformBool } from 'src/helper/validator.helper';

export function toPrismQuery(query: BrowseDto, options: { trashSystem: boolean } = { trashSystem: true }) {
	// where
	let wheres = {};
	if (query && query.where) {
		query.where.split(' ').forEach((q) => {
			let [col, value] = q.split(':');
			let val: any = value;
			if (isNumber(val)) {
				val = val;
			} else if (isBoolean(transformBool({ value: val }))) {
				val = val === 'true';
			}
			wheres[col] = val;
		});
	}

	// search
	let likes = {};
	if (query && query.search) {
		query.search.split(' ').forEach((q) => {
			const [col, val] = q.split(':');
			likes[col] = {
				startsWith: val,
			};
		});
	}

	// in
	let in_ = {};
	if (query && query.in_) {
		query.in_.split(' ').forEach((q) => {
			const [col, val] = q.split(':');
			in_[col] = {
				in: val.split(','),
			};
		});
	}

	// not in
	let notIn_ = {};
	if (query && query.nin_) {
		query.nin_.split(' ').forEach((q) => {
			const [col, val] = q.split(':');
			in_[col] = {
				notIn: val.split(','),
			};
		});
	}

	// is not
	let not_ = {};
	if (query && query.not_) {
		query.not_.split(' ').forEach((q) => {
			const [col, val] = q.split(':');
			not_[col] = {
				not: val,
			};
		});
	}

	// is null
	let isnull = {};
	if (query && query.isnull) {
		query.isnull.split(' ').forEach((q) => {
			isnull[q] = null;
		});
	}

	// order by
	let orderBy = {};
	if (query && query.order) {
		query.order.split(' ').forEach((q) => {
			const [col, val] = q.split(':');
			orderBy[col] = val;
		});
	}

	// trash system
	if (options.trashSystem) {
		wheres['is_deleted'] = false;
		if (query.trash) wheres['is_deleted'] = true;
		if (query.all) delete wheres['is_deleted'];
	}

	// pagination
	let pagination = {};

	if (query && query.limit && query.limit > 0) {
		pagination['take'] = query.limit;
	}

	if (query && query.paginate) {
		if (pagination['take'] && pagination['take'] > 0) {
			const page = query.page && query.page > 0 ? query.page : 1;
			pagination['skip'] = (page - 1) * (pagination['take'] || 0);
		}
	}

	return {
		where: {
			AND: [wheres, likes, in_, not_, notIn_, isnull],
		},
		take: pagination['take'],
		skip: pagination['skip'],
		orderBy: orderBy,
	};
}

export function toPrismSelect(include: string[], exclude?: string[]) {
	if (!include.length) return undefined;

	const select = {};

	include.forEach((key) => {
		const parts = key.split('.');
		let current = select;

		parts.forEach((part, index) => {
			if (!current[part]) {
				if (index === parts.length - 1) {
					current[part] = true;
				} else {
					current[part] = {};
					current[part].select = {};
				}
			} else if (index === parts.length - 1 && typeof current[part] === 'object' && !current[part].select) {
				current[part].select = {};
			}
			current = current[part].select;
		});
	});

	if (exclude && exclude.length) {
		exclude.forEach((key) => {
			select[key] = false;
		});
	}

	return Object.keys(select).length === 0 ? undefined : select;
}

export function excludePrismaSelect<T>(result: any | any[], fields: string[]): T {
	if (Array.isArray(result)) {
		result.forEach((r) => {
			fields.forEach((f) => delete r[f]);
		});
	} else {
		fields.forEach((f) => delete result[f]);
	}
	return result;
}
