import { Injectable } from '@nestjs/common';
import { InputJsonObject } from '@prisma/client/runtime/client';
import { nanoid } from 'nanoid';
import { AiService } from 'src/ai/ai.service';
import { AppException } from 'src/common/exceptions/app.exception';
import { ErrorCode } from 'src/common/exceptions/error-code';
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
    //리뷰 갯수가 0개면 예외처리
    if (reviews.length === 0) {
      throw new AppException({
        message: '리뷰가 없습니다.',
        errorCode: ErrorCode.REVIEW_NOT_FOUND,
      });
    }
    // 리뷰 문자열 조합
    const reviewText = reviews
      .map((review) => `제목:${review.reviewTitle}\n내용:${review.content}`)
      .join('\n');

    // AI 분석 요청
    //요청 시작 시간
    const startTime = Date.now();
    try {
      const result = await this.aiService.analyzeReviews(reviewText);
      //요청 종료 시간
      const endTime = Date.now();
      //요청 소요 시간
      const latencyMs = endTime - startTime;
      //요청 로그 저장
      await this.db.aiLog.create({
        data: {
          id: nanoid(),
          reviewId: null,
          taskType: 'REVIEW_ANALYSIS',
          status: 'SUCCESS',
          requestPayloadJson: {
            movieTitle,
            reviewCount: reviews.length,
            reviewText,
          },
          responsePayloadJson: result as unknown as InputJsonObject,
          modelName: 'gpt-4o-mini',
          promptVersionId: '1',
          latencyMs,
        },
      });
      // 분석 결과 저장
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
      return analysisResult; //저장 결과 반환
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      await this.db.aiLog.create({
        data: {
          id: nanoid(),
          reviewId: null,
          taskType: 'REVIEW_ANALYSIS',
          status: 'FAILED',
          requestPayloadJson: {
            reviewText: reviewText,
          },
          modelName: 'gpt-4o-mini',
          promptVersionId: '1',
          latencyMs: latencyMs,
          errorMessage: error.message,
        },
      });
      console.error('Error analyzing review:', error);
      throw error;
    }
  }
}
