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
  async analyzeReviews(reviewText: string): Promise<AnalysisResult> {
    //1.prompt를 작성한다.
    const sysPrompt = `너는 영화 리뷰 분석 전문가다.
    입력으로 주어지는 동일 영화에 대한 여러 사용자 리뷰를 종합 분석해서,
    반드시 JSON 객체 하나만 반환해야 한다.

    중요 규칙:
    - 반드시 JSON만 반환한다.
    - 코드블록(\`\`\`json) 없이 반환한다.
    - 설명 문장 없이 반환한다.
    - 모든 키 이름은 아래 스키마와 정확히 일치해야 한다.
    - sentiment 값은 반드시 "POSITIVE", "NEGATIVE", "MIXED" 중 하나만 사용한다.
    - prosJson, consJson, keywordsJson은 반드시 문자열 배열로 반환한다.
    - recommendationText는 문자열로 반환한다.
    - genreCategory는 영화 장르를 한 단어 또는 짧은 구문으로 반환한다.
    - moodCategory는 영화의 분위기를 한 단어 또는 짧은 구문으로 반환한다.
    - isSpoiler는 boolean 값(true 또는 false)로 반환한다.
    - confidenceScore는 0.00 이상 1.00 이하의 숫자로 반환한다.
    - 리뷰에 스포일러가 명확히 포함된 경우에만 isSpoiler를 true로 반환한다.

    반환 스키마:
    {
      "sentiment": "POSITIVE | NEGATIVE | MIXED",
      "summary": "string",
      "prosJson": ["string", "string"],
      "consJson": ["string", "string"],
      "recommendationText": "string",
      "keywordsJson": ["string", "string", "string"],
      "genreCategory": "string",
      "moodCategory": "string",
      "isSpoiler": false,
      "confidenceScore": 0.85
    }`;
    const userPrompt = `
    이 리뷰들을 종합 분석해서 JSON으로만 반환해줘.
    리뷰 목록:
    ${reviewText}
    `;

    //2.openai api를 호출한다.
    const result = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: sysPrompt },
        { role: 'user', content: userPrompt },
      ],
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
