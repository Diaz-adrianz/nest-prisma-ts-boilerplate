import { IsNumber, IsOptional, IsString } from 'class-validator';
import { IsBool, IsContain } from '../validator.helper';

export class BrowseDto {
	@IsString()
	@IsOptional()
	search?: string;

	@IsString()
	@IsContain(':', 'middle')
	@IsOptional()
	where?: string;

	@IsString()
	@IsContain(':', 'middle')
	@IsOptional()
	in_?: string;

	@IsString()
	@IsContain(':', 'middle')
	@IsOptional()
	nin_?: string;

	@IsString()
	@IsContain(':', 'middle')
	@IsOptional()
	not_?: string;

	@IsString()
	@IsOptional()
	isnull?: string;

	@IsBool()
	@IsOptional()
	paginate?: boolean = true;

	@IsNumber()
	@IsOptional()
	limit?: number = 10;

	@IsNumber()
	@IsOptional()
	page?: number = 1;

	@IsString()
	@IsContain(':', 'middle')
	@IsOptional()
	order?: string = 'updated_at:desc';

	@IsBool()
	@IsOptional()
	trash?: boolean = false;

	@IsBool()
	@IsOptional()
	all?: boolean = false;
}
