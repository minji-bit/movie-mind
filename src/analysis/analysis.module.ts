import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { ReviewService } from 'src/review/review.service';
import { AiService } from 'src/ai/ai.service';

@Module({
  providers: [AnalysisService, ReviewService, AiService],
  controllers: [AnalysisController],
})
export class AnalysisModule {}
