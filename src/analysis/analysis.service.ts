import { Injectable } from '@nestjs/common';
import { InputJsonObject } from '@prisma/client/runtime/client';
import { nanoid } from 'nanoid';
import { AiService } from 'src/ai/ai.service';
import { AppException } from 'src/common/exceptions/app.exception';
import { ErrorCode } from 'src/common/exceptions/error-code';
import { PromptTaskType } from 'src/generated/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetPromptVersionDto } from 'src/prompt-version/dto/getPromptVersion.dto';
import { PromptVersionService } from 'src/prompt-version/prompt-version.service';
import { ReviewService } from 'src/review/review.service';

@Injectable()
export class AnalysisService {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly aiService: AiService,
    private readonly db: PrismaService,
    private readonly promptVersionService: PromptVersionService,
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
    //상태변경 REQUESTED
    await this.db.movieReview.updateMany({
      where: { movieTitle: movieTitle },
      data: {
        analysisStatus: 'REQUESTED',
        analysisRequestedAt: new Date().toISOString(),
      },
    });
    // 리뷰 문자열 조합
    const reviewText = reviews
      .map((review) => `제목:${review.reviewTitle}\n내용:${review.content}`)
      .join('\n');

    //요청 시작 시간
    const startTime = Date.now();
    try {
      //상태변경 ANALYZING
      await this.db.movieReview.updateMany({
        where: { movieTitle: movieTitle },
        data: {
          analysisStatus: 'ANALYZING',
          analysisStartedAt: new Date().toISOString(),
        },
      });

      //프롬프트 버전 조회
      const prompt: GetPromptVersionDto | null =
        await this.promptVersionService.getPromptVersions();
      if (!prompt) {
        throw new AppException({
          message: '프롬프트 버전이 없습니다.',
          errorCode: ErrorCode.ACTIVE_PROMPT_NOT_FOUND,
        });
      }
      //AI 분석 요청
      const result = await this.aiService.analyzeReviews(reviewText, prompt);
      //상태변경 ANALYZED
      await this.db.movieReview.updateMany({
        where: { movieTitle: movieTitle },
        data: {
          analysisStatus: 'ANALYZED',
          analysisCompletedAt: new Date().toISOString(),
        },
      });
      //요청 종료 시간
      const endTime = Date.now();
      //요청 소요 시간
      const latencyMs = endTime - startTime;
      //요청 로그 저장
      await this.db.aiLog.create({
        data: {
          id: nanoid(),
          reviewId: null,
          taskType: prompt.taskType,
          status: 'SUCCESS',
          requestPayloadJson: {
            movieTitle,
            reviewCount: reviews.length,
            reviewText,
          },
          responsePayloadJson: result as unknown as InputJsonObject,
          modelName: 'gpt-4o-mini',
          promptVersionId: prompt.id,
          latencyMs,
        },
      });

      const existing = await this.db.analysisResult.findFirst({
        where: {
          movieTitle: movieTitle,
        },
      });
      if (existing) {
        await this.db.analysisResult.update({
          where: { id: existing.id },
          data: {
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
            promptVersionId: prompt.id,
          },
        });
      } else {
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
            promptVersionId: prompt.id,
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
      }
    } catch (error) {
      //상태변경 FAILED
      await this.db.movieReview.updateMany({
        where: { movieTitle: movieTitle },
        data: {
          analysisStatus: 'FAILED',
          analysisCompletedAt: new Date().toISOString(),
          lastAnalysisError: error.message,
          analysisRetryCount: {
            increment: 1,
          },
        },
      });
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
          promptVersionId: null,
          latencyMs: latencyMs,
          errorMessage: error.message,
        },
      });
      console.error('Error analyzing review:', error);
      throw error;
    }
  }

  async getAnalysisResult(movieTitle: string) {
    const analysisResult = await this.db.analysisResult.findFirst({
      where: { movieTitle: movieTitle },
      select: {
        movieTitle: true,
        summary: true,
        prosJson: true,
        consJson: true,
        recommendationText: true,
        keywordsJson: true,
        sentiment: true,
        genreCategory: true,
        moodCategory: true,
        confidenceScore: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!analysisResult) {
      throw new AppException({
        message: '분석 결과가 없습니다.',
        errorCode: ErrorCode.ANALYSIS_RESULT_NOT_FOUND,
      });
    }

    return analysisResult;
  }

  async getAnalysisResults() {
    const analysisResults = await this.db.analysisResult.findMany({
      select: {
        movieTitle: true,
        summary: true,
        prosJson: true,
        consJson: true,
        recommendationText: true,
        keywordsJson: true,
        sentiment: true,
        genreCategory: true,
        moodCategory: true,
        confidenceScore: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return analysisResults;
  }
}
