import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestCreateReviewDto } from './dto/requestCreateReview.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class ReviewService {
  constructor(private readonly db: PrismaService) {}

  async createReview(userId: string, dto: RequestCreateReviewDto) {
    const review = await this.db.movieReview.create({
      data: {
        ...dto,
        id: nanoid(),
        userId: userId,
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
    return review;
  }
}
