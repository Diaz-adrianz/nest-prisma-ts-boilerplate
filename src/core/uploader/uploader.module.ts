import { Module } from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { UploaderController } from './uploader.controller';

@Module({
	controllers: [UploaderController],
	providers: [UploaderService],
	exports: [UploaderService],
})
export class UploaderModule {}
