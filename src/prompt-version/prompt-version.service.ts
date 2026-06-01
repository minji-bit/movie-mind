import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePromptVersionDto } from './dto/createPromptVersion.dto';
import { nanoid } from 'nanoid';
import { PromptTaskType } from 'src/generated/prisma/client';

@Injectable()
export class PromptVersionService {
  constructor(private readonly db: PrismaService) {}

  async createPromptVersion(dto: CreatePromptVersionDto) {
    return this.db.promptVersion.create({
      data: {
        id: nanoid(),
        taskType: dto.taskType as PromptTaskType,
        version: dto.version,
        name: dto.name,
        systemPrompt: dto.systemPrompt,
        userPromptTemplate: dto.userPromptTemplate,
      },
    });
  }

  async activatePromptVersion(promptVersionId: string) {
    return this.db.promptVersion.update({
      where: { id: promptVersionId },
      data: { isActive: true },
    });
  }

  async getPromptVersions() {
    return this.db.promptVersion.findFirst({
      where: {
        isActive: true,
        taskType: PromptTaskType.REVIEW_ANALYSIS,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        taskType: true,
        systemPrompt: true,
        userPromptTemplate: true,
      },
    });
  }
}
