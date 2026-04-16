import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestCreateReviewDto } from './dto/requestCreateReview.dto';
import { nanoid } from 'nanoid';
import { ResponseCreateReviewDto } from './dto/responseCreateReview.dto';
import { ResponseGetReviewDto } from './dto/responseGetReview.dto';
import { AppException } from 'src/common/exceptions/app.exception';
import { ErrorCode } from 'src/common/exceptions/error-code';
import { Review } from 'src/type';

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

  async getReviewsByMovieTitle(movieTitle: string) {
    /*const reviews = await this.db.movieReview.findMany({
      select: {
        movieTitle: true,
        reviewTitle: true,
        content: true,
      },
      where: {
        movieTitle,
      },
    });*/
    const reviews: Review[] = [
      {
        movieTitle: '인터스텔라',
        reviewTitle: '감동적인 가족 이야기',
        content:
          '스토리가 조금 어렵긴 했지만 감정적으로 너무 몰입됐어요. 특히 가족 이야기 부분에서 눈물 났습니다. 음악도 정말 인상적이었어요.',
      },
      {
        movieTitle: '인터스텔라',
        reviewTitle: '압도적인 영상미',
        content:
          '영상미가 압도적이고 우주 장면이 정말 현실감 있게 느껴졌습니다. 과학적인 설정도 흥미로웠고 전체적으로 완성도가 높은 영화라고 생각합니다.',
      },
      {
        movieTitle: '인터스텔라',
        reviewTitle: '이해하기 어려운 영화',
        content:
          '아이디어는 좋았는데 내용이 좀 어려워서 이해하기 힘들었어요. 집중해서 보면 괜찮지만 가볍게 보기에는 부담스러운 영화입니다.',
      },
      {
        movieTitle: '인터스텔라',
        reviewTitle: '전개가 아쉬웠어요',
        content:
          '중간부터 전개가 너무 늘어지는 느낌이었습니다. 러닝타임이 길어서 지루하게 느껴졌고 기대했던 것보다는 아쉬웠어요.',
      },
      {
        movieTitle: '인터스텔라',
        reviewTitle: '연기와 음악은 최고',
        content:
          '배우 연기와 음악이 정말 좋았고 감동적인 장면이 많았습니다. 다만 스토리가 복잡해서 한 번에 이해하기는 조금 어려웠습니다.',
      },
    ];

    return reviews;
  }
}
