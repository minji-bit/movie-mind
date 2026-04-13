import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestCreateReviewDto } from './dto/requestCreateReview.dto';
import { nanoid } from 'nanoid';
import { ResponseCreateReviewDto } from './dto/responseCreateReview.dto';
import { ResponseGetReviewDto } from './dto/responseGetReview.dto';
import { AppException } from 'src/common/exceptions/app.exception';
import { ErrorCode } from 'src/common/exceptions/error-code';

@Injectable()
export class ReviewService {
  constructor(private readonly db: PrismaService) {}

  async createReview(
    userId: string,
    dto: RequestCreateReviewDto,
  ): Promise<ResponseCreateReviewDto> {
    const review = await this.db.movieReview.create({
      data: {
        id: nanoid(),
        userId: userId,
        ...dto,
      },
      select: {
        id: true,
        movieTitle: true,
        reviewTitle: true,
        content: true,
        rating: true,
        analysisStatus: true,
        createdAt: true,
      },
    });
    return {
      id: review.id,
      movieTitle: review.movieTitle,
      reviewTitle: review.reviewTitle,
      content: review.content,
      rating: review.rating.toNumber(),
      analysisStatus: review.analysisStatus,
      createdAt: review.createdAt,
    };
  }

  async getReviews(): Promise<ResponseGetReviewDto[]> {
    const reviews = await this.db.movieReview.findMany({
      select: {
        id: true,
        movieTitle: true,
        content: true,
        rating: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return reviews.map((review) => {
      return {
        id: review.id,
        movieTitle: review.movieTitle,
        content: review.content,
        rating: review.rating.toNumber(),
        createdAt: review.createdAt,
      };
    });
  }

  async getReviewDetail(id: string) {
    const review = await this.db.movieReview.findUnique({
      where: {
        id: id,
      },
    });
    if (!review) {
      throw new AppException({
        message: '해당하는 리뷰가 존재하지 않습니다.',
        errorCode: ErrorCode.REVIEW_NOT_FOUND,
      });
    }
    return review;
  }
}
