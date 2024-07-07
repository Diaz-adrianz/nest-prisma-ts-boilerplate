import { Test, TestingModule } from '@nestjs/testing';
import { UploaderController } from './uploader.controller';
import { UploaderService } from './uploader.service';

describe('UploaderController', () => {
  let controller: UploaderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploaderController],
      providers: [UploaderService],
    }).compile();

    controller = module.get<UploaderController>(UploaderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
