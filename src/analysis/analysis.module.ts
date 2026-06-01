import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { ReviewService } from 'src/review/review.service';
import { AiService } from 'src/ai/ai.service';
import { PromptVersionService } from 'src/prompt-version/prompt-version.service';

@Module({
  providers: [AnalysisService, ReviewService, AiService, PromptVersionService],
  controllers: [AnalysisController],
})
export class AnalysisModule {}
