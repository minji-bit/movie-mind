import { Test, TestingModule } from '@nestjs/testing';
import { AiLogService } from './ai-log.service';

describe('AiLogService', () => {
  let service: AiLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiLogService],
    }).compile();

    service = module.get<AiLogService>(AiLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
