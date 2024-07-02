import { IsBoolean, IsEmail, IsOptional, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';
import { IsMatchWith } from 'src/helper/validator.helper';

export class CreateUserDto {
	@IsString()
	@MinLength(4)
	@MaxLength(24)
	username: string;

	@IsString()
	@IsEmail()
	email: string;

	@IsStrongPassword()
	@MinLength(8)
	@MaxLength(16)
	password: string;

	@IsMatchWith('password')
	confirm_password: string;

	@IsBoolean()
	@IsOptional()
	is_active: boolean = true;
}
