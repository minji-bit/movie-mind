import { Test, TestingModule } from '@nestjs/testing';
import { PromptVersionController } from './prompt-version.controller';

describe('PromptVersionController', () => {
  let controller: PromptVersionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromptVersionController],
    }).compile();

    controller = module.get<PromptVersionController>(PromptVersionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
