export enum ErrorCode {
  EMAIL_ALREADY_EXISTS = '이미 존재하는 이메일 입니다.',
  USER_NOT_FOUND = '존재하지 않는 사용자입니다.',
  INVALID_PASSWORD = '유효하지 않은 비밀번호입니다.',
  INTERNAL_SERVER_ERROR = '내부 서버 오류입니다.',
  REVIEW_NOT_FOUND = '존재하지 않는 리뷰입니다.',
  REVIEW_DELETE_FORBIDDEN = '리뷰 삭제 권한이 없습니다.',
  FORBIDDEN = '권한이 없습니다.',
  ANALYSIS_RESULT_NOT_FOUND = '존재하지 않는 분석 결과입니다.',
  ACTIVE_PROMPT_NOT_FOUND = '활성화된 프롬프트가 존재하지 않습니다.',
}
