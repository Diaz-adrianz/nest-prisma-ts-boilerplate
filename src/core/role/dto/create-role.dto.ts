import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
	@IsString()
	name: string;

	@IsString()
	description: string;

	@IsBoolean()
	@IsOptional()
	is_active: boolean = true;
}
