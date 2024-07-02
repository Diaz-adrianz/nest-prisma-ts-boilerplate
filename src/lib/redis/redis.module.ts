import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisModule as RedisMod } from '@nestjs-modules/ioredis';

@Module({
	imports: [
		RedisMod.forRoot({
			type: 'single',
			options: {
				host: process.env.REDIS_HOST,
				port: parseInt(process.env.REDIS_PORT),
			},
		}),
	],
	providers: [RedisService],
	exports: [RedisService],
})
export class RedisModule {}
