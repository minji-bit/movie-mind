import { Injectable } from '@nestjs/common';
import { Review } from 'src/type';

@Injectable()
export class AiService {
  async analyzeReviews() {
    return '분석결과입니다.';
  }
}
