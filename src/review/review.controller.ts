import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { RequestCreateReviewDto } from './dto/requestCreateReview.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseCreateReviewDto } from './dto/responseCreateReview.dto';
import { ResponseGetReviewDto } from './dto/responseGetReview.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(
    @Req() req: any,
    @Body() dto: RequestCreateReviewDto,
  ): Promise<ResponseCreateReviewDto> {
    return this.reviewService.createReview(req.user.id, dto);
  }

  @Get()
  async getReviews(): Promise<ResponseGetReviewDto[]> {
    return this.reviewService.getReviews();
  }

  @Get(':id')
  async getReviewDetail(@Param('id') id: string) {
    return this.reviewService.getReviewDetail(id);
  }
}
