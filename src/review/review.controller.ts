import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { RequestCreateReviewDto } from './dto/requestCreateReview.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(@Req() req: any, @Body() dto: RequestCreateReviewDto) {
    return this.reviewService.createReview(req.user.id, dto);
  }
}
