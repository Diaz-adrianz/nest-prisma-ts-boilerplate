import { Controller } from '@nestjs/common';
import { UploaderService } from './uploader.service';

@Controller('uploader')
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}
}
