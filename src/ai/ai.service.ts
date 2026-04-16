import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import { Review } from 'src/type';

@Injectable()
export class AiService {
  private openai: OpenAI;
  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }
  async analyzeReviews(reviews: Review[]) {
    //1.review를 하나의 텍스트로 합친다.
    const reviewText = reviews
      .map((review) => `제목:${review.reviewTitle}\n내용:${review.content}`)
      .join('\n');
    //2.prompt를 작성한다.
    const prompt = `다음 영화 리뷰들을 분석해줘:
    [리뷰들]
    ${reviewText}
    결과를 아래 형식으로 만들어줘:
    1. 전체 요약
    2. 장점
    3. 단점
    4. 추천 대상`;

    //3.openai api를 호출한다.
    const result = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });
    console.log(result);
    return result.choices[0].message.content;
  }
}
