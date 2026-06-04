import { AiLogStatus, PromptTaskType } from 'src/generated/prisma/client';
import { InputJsonObject } from 'src/generated/prisma/internal/prismaNamespace';

export class ResponseGetAiLogsDto {
  id: string;
  reviewId: string;
  taskType: PromptTaskType;
  status: AiLogStatus;
  requestPayloadJson: InputJsonObject;
  responsePayloadJson: InputJsonObject;
  modelName: string;
  promptVersionId: string;
  errorMessage: string;
  latencyMs: number;
  createdAt: Date;
}
