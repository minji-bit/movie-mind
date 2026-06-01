import { Module } from '@nestjs/common';
import { PromptVersionService } from './prompt-version.service';
import { PromptVersionController } from './prompt-version.controller';

@Module({
  providers: [PromptVersionService],
  controllers: [PromptVersionController],
  exports: [PromptVersionService],
})
export class PromptVersionModule {}
