import { Controller, Get } from '@nestjs/common';
import { AiLogService } from './ai-log.service';
import { ResponseGetAiLogsDto } from './dto/responseLogs.dto';

@Controller('ai-logs')
export class AiLogController {
  constructor(private readonly aiLogService: AiLogService) {}

  @Get()
  async getAiLogs(): Promise<ResponseGetAiLogsDto[]> {
    return await this.aiLogService.getAiLogs();
  }
}
