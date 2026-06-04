import { Injectable } from '@nestjs/common';
import { ResponseGetAiLogsDto } from './dto/responseLogs.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AiLogService {
  constructor(private readonly db: PrismaService) {}

  async getAiLogs(): Promise<ResponseGetAiLogsDto[]> {
    return (await this.db.aiLog.findMany({
      select: {
        id: true,
        reviewId: true,
        taskType: true,
        status: true,
        requestPayloadJson: true,
        responsePayloadJson: true,
        modelName: true,
        promptVersionId: true,
        errorMessage: true,
        latencyMs: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })) as ResponseGetAiLogsDto[];
  }
}
