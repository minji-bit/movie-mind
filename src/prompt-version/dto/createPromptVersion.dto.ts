export class CreatePromptVersionDto {
  taskType: string; //REVIEW_ANALYSIS, REVIEW_RECOMMENDATION
  version: string;
  name: string;
  systemPrompt: string;
  userPromptTemplate: string;
}
