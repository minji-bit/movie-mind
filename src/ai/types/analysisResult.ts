export default interface AnalysisResult {
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'MIXED';
  summary: string;
  prosJson: string[];
  consJson: string[];
  recommendationText: string;
  keywordsJson: string[];
  genreCategory: string;
  moodCategory: string;
  isSpoiler: boolean;
  confidenceScore: number;
}
