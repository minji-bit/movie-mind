import { Controller, Param, Post } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { ReviewService } from 'src/review/review.service';
import { AiService } from 'src/ai/ai.service';

@Controller('analysis')
export class AnalysisController {
  constructor(
    private readonly analysisService: AnalysisService,
    private readonly reviewService: ReviewService,
    private readonly aiService: AiService,
  ) {}

  @Post(':movieTitle')
  async analyzeReview(@Param('movieTitle') movieTitle: string) {
    await this.reviewService.getReviewsByMovieTitle(movieTitle);
    return await this.aiService.analyzeReviews();
  }
}
