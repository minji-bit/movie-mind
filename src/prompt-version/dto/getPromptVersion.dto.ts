import { PromptTaskType } from 'src/generated/enums';

export class GetPromptVersionDto {
  id: string;
  taskType: PromptTaskType;
  systemPrompt: string;
  userPromptTemplate: string;
}
