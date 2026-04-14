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
    const review = this.findReviewById(id);
    if (!review) {
      throw new AppException({
        message: '해당하는 리뷰가 존재하지 않습니다.',
        errorCode: ErrorCode.REVIEW_NOT_FOUND,
      });
    }
    return review;
  }

  async deleteReview(id: string, userId: string) {
    //id로 리뷰조회
    const review = await this.findReviewById(id);
    //없으면 예외처리
    if (!review) {
      throw new AppException({
        message: '해당하는 리뷰가 존재하지 않습니다.',
        errorCode: ErrorCode.REVIEW_NOT_FOUND,
      });
    }
    //본인 리뷰만 삭제 가능하게 처리
    //1.로그인 사용자 userId 확인
    //2.리뷰 작성자 userId와 비교
    //3.다르면 예외처리
    if (userId !== review.userId) {
      throw new AppException({
        message: '작성자만 삭제 가능합니다.',
        errorCode: ErrorCode.REVIEW_DELETE_FORBIDDEN,
      });
    }

    //삭제처리
    const res = await this.db.movieReview.delete({
      where: {
        id,
      },
    });

    return res ? '삭제가 완료되었습니다.' : '삭제에 실패했습니다.';
  }

  private async findReviewById(id: string) {
    return await this.db.movieReview.findUnique({
      where: {
        id,
      },
    });
  }

  async updateReview(id: string, dto: RequestCreateReviewDto, userId: string) {
    //1. 리뷰 존재확인
    const review = await this.db.movieReview.findUnique({
      where: {
        id,
      },
    });
    if (!review)
      throw new AppException({
        message: '존재하지 않는 리뷰입니다.',
        errorCode: ErrorCode.REVIEW_NOT_FOUND,
      });
    //2. 작성자 검증
    if (userId !== review.userId)
      throw new AppException({
        message: '리뷰 작성자만 수정할 수 있습니다.',
        errorCode: ErrorCode.FORBIDDEN,
      });

    const res = await this.db.movieReview.update({
      data: {
        ...dto,
      },
      where: {
        id,
      },
    });
    return res ? '리뷰가 수정되었습니다.' : '리뷰 수정이 실패했습니다.';
  }
}
