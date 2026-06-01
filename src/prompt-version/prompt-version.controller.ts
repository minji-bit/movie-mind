import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PromptVersionService } from './prompt-version.service';
import { CreatePromptVersionDto } from './dto/createPromptVersion.dto';

@Controller('prompt-versions')
export class PromptVersionController {
  constructor(private readonly promptVersionService: PromptVersionService) {}

  @Post()
  async createPromptVersion(@Body() dto: CreatePromptVersionDto) {
    return this.promptVersionService.createPromptVersion(dto);
  }

  @Patch(':promptVersionId/activate')
  async activatePromptVersion(
    @Param('promptVersionId') promptVersionId: string,
  ) {
    return this.promptVersionService.activatePromptVersion(promptVersionId);
  }

  @Get()
  async getPromptVersions() {
    return this.promptVersionService.getPromptVersions();
  }
}
