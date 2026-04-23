import { Injectable } from '@nestjs/common';
import { InputJsonObject } from '@prisma/client/runtime/client';
import { nanoid } from 'nanoid';
import { AiService } from 'src/ai/ai.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReviewService } from 'src/review/review.service';

@Injectable()
export class AnalysisService {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly aiService: AiService,
    private readonly db: PrismaService,
  ) {}

  async analyzeReview(movieTitle: string) {
    //해당 영화 리뷰들 조회
    const reviews = await this.reviewService.getReviewsByMovieTitle(movieTitle);
    // 리뷰 문자열 조합
    const reviewText = reviews
      .map((review) => `제목:${review.reviewTitle}\n내용:${review.content}`)
      .join('\n');
    // AI 분석 요청
    const result = await this.aiService.analyzeReviews(reviewText);
    // 분석 결과 저장
    try {
      const analysisResult = await this.db.analysisResult.create({
        data: {
          id: nanoid(),
          movieTitle,
          reviewCount: reviews.length,
          sentiment: result.sentiment,
          summary: result.summary,
          prosJson: result.prosJson as unknown as InputJsonObject,
          consJson: result.consJson as unknown as InputJsonObject,
          recommendationText: result.recommendationText,
          keywordsJson: result.keywordsJson as unknown as InputJsonObject,
          genreCategory: result.genreCategory,
          moodCategory: result.moodCategory,
          isSpoiler: result.isSpoiler,
          confidenceScore: result.confidenceScore,
          rawResultJson: result as unknown as InputJsonObject,
          promptVersionId: '1',
        },
        select: {
          id: true,
          movieTitle: true,
          reviewCount: true,
          sentiment: true,
          summary: true,
          prosJson: true,
          consJson: true,
          recommendationText: true,
          keywordsJson: true,
          genreCategory: true,
          moodCategory: true,
          isSpoiler: true,
          confidenceScore: true,
          rawResultJson: true,
          promptVersionId: true,
          createdAt: true,
        },
      });
      return analysisResult;
    } catch (error) {
      console.error('Error analyzing review:', error);
      throw error;
    }

    //저장 결과 반환
  }
}
