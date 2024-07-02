import { BrowseDto } from './dto/browse.dto';

export function paginateResponse(data: any[], count: number, query: BrowseDto) {
	const size = query.limit <= 0 ? count : query.limit;

	return {
		total_items: count,
		page: query.page,
		limit: size,
		total_pages: Math.ceil(count / size) || 1,
		items: data,
	};
}

export function successResponse(data: any, message: string = 'success') {
	return {
		message,
		data,
	};
}
