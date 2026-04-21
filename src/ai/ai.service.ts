import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import { Review } from 'src/type';
import AnalysisResult from './types/analysisResult';

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
    const prompt = `다음 리뷰들을 분석해서 반드시 JSON 형식으로 결과를 반환해줘.
    [리뷰들]
    ${reviewText}
    형식:
      {
        "summary": "...",
        "pros": ["..."],
        "cons": ["..."],
        "recommendation": "..."
      }`;

    //3.openai api를 호출한다.
    const result = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });
    try {
      const cleaned =
        result.choices[0].message?.content
          ?.replace(/```json\s*/i, '')
          .replace(/```/g, '')
          .trim() || '{}';

      const analysisResult: AnalysisResult = JSON.parse(cleaned);
      return analysisResult;
    } catch (error) {
      console.error('Raw AI content:', result.choices[0].message?.content);
      console.error('Error parsing JSON:', error);
      throw error;
    }
  }
}
