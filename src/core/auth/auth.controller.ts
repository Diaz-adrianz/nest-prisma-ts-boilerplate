import { Body, Controller, Delete, Get, HttpCode, Post, Query, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { successResponse } from 'src/helper/response.helper';
import { Response as Res } from 'express';
import { constant } from 'src/config';
import { Public } from 'src/helper/decorators/auth.decorator';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('register')
	async register(@Body() registerDto: RegisterDto) {
		await this.authService.register(registerDto);
		return successResponse(null, 'Check your inbox to verify your account');
	}

	@Public()
	@Post('login')
	@HttpCode(200)
	async login(@Body() loginDto: LoginDto, @Response() res: Res) {
		const { user, at, rt } = await this.authService.login(loginDto);

		// store refresh token in client cookie httpOnly
		const rtExp = new Date();
		rtExp.setTime(rtExp.getTime() + constant.JWT_REFRESH_EXP);
		res.cookie(constant.RT_KEY_IN_COOKIE, rt, { httpOnly: true, expires: rtExp });

		res.json(successResponse({ user, token: { access: at } }, 'Login successfully'));
		return res;
	}

	@Public()
	@Get('refresh')
	async refreshToken() {
		const { at } = await this.authService.refreshToken();
		return successResponse({ token: { access: at } }, 'Access refreshed successfully');
	}

	@Delete('logout')
	async logout(@Response() res: Res) {
		await this.authService.logout();

		res.clearCookie(constant.RT_KEY_IN_COOKIE);
		res.json(successResponse(null, 'Logout successfully'));
		return res;
	}

	@Public()
	@Get('email-verification')
	async emailVerification(@Query('token') token: string) {
		await this.authService.verifyEmail(token);
		return successResponse(null, 'Email verified successfully');
	}
}
