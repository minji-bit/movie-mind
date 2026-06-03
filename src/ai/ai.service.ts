import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import { Review } from 'src/type';
import AnalysisResult from './types/analysisResult';
import { GetPromptVersionDto } from 'src/prompt-version/dto/getPromptVersion.dto';

@Injectable()
export class AiService {
  private openai: OpenAI;
  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }
  async analyzeReviews(
    reviewText: string,
    prompt: GetPromptVersionDto,
  ): Promise<AnalysisResult | undefined> {
    //1.prompt를 작성한다.
    const sysPrompt = prompt.systemPrompt;
    const userPrompt = prompt.userPromptTemplate.replace(
      '{{reviewText}}',
      reviewText,
    );

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

      const analysisResult: AnalysisResult | undefined = JSON.parse(cleaned);
      return analysisResult;
    } catch (error) {
      console.error('Raw AI content:', result.choices[0].message?.content);
      console.error('Error parsing JSON:', error);

      throw error;
    }
  }
}
