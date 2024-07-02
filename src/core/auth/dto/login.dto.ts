import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
	@IsString()
	@MinLength(4)
	@MaxLength(24)
	username: string;

	@IsString()
	@MinLength(8)
	password: string;
}
