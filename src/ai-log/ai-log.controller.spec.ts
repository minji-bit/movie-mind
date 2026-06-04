import { Test, TestingModule } from '@nestjs/testing';
import { AiLogController } from './ai-log.controller';

describe('AiLogController', () => {
  let controller: AiLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiLogController],
    }).compile();

    controller = module.get<AiLogController>(AiLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
