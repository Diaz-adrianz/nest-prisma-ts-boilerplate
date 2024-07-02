import { Global, Module } from '@nestjs/common';
import { TokenizeService } from './tokenize.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
	imports: [JwtModule.register({})],
	providers: [TokenizeService, JwtService],
	exports: [TokenizeService],
})
export class TokenizeModule {}
