import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
  providers: [ReviewService, JwtAuthGuard],
  controllers: [ReviewController],
})
export class ReviewModule {}
