# 🎬 MovieMind

AI 기반 영화 리뷰 종합 분석 플랫폼

MovieMind는 동일 영화에 대한 여러 사용자의 리뷰를 수집하고, AI를 활용하여 리뷰를 종합 분석한 결과를 제공하는 서비스입니다.

단순히 개별 리뷰를 분석하는 것이 아니라 여러 리뷰를 종합하여 영화에 대한 감정, 장단점, 추천 의견을 도출하는 것을 목표로 합니다.

---

# 📌 프로젝트 소개

사용자가 작성한 영화 리뷰를 기반으로 AI가 종합 분석을 수행하여 다음과 같은 정보를 제공합니다.

- 영화에 대한 전체 감성 분석
- 주요 장점 및 단점 분석
- 추천 대상 분석
- 키워드 추출
- 장르 및 분위기 분류

---

# 🛠 기술 스택

## Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)

## Authentication

- JWT Authentication
- Bcrypt

## AI

- OpenAI API
- Structured Output(JSON)

## Etc

- Nanoid

---

# ✨ 주요 기능

## 사용자

- 회원가입
- 로그인
- 내 정보 조회

## 리뷰

- 영화 리뷰 등록
- 영화 리뷰 조회
- 영화 리뷰 수정
- 영화 리뷰 삭제

## AI 분석

- 영화 리뷰 종합 분석
- 분석 결과 저장
- 분석 결과 조회

## 운영 기능

- AI 요청/응답 로그 저장
- AI 요청/응답 로그 조회
- Prompt Version 관리
- 분석 상태 관리

---

# 🤖 AI 분석 프로세스

1. 동일 영화에 대한 리뷰 조회
2. 활성화된 Prompt Version 조회
3. OpenAI API 호출
4. JSON Structured Output 생성
5. AnalysisResult 저장
6. AI Log 저장
7. 분석 결과 반환

---

# 📊 분석 결과 예시

- 감성 분석 (POSITIVE / NEGATIVE / MIXED)
- 요약(Summary)
- 장점(Pros)
- 단점(Cons)
- 추천 의견(Recommendation)
- 주요 키워드
- 장르 분류
- 분위기 분류
- 스포일러 여부
- 신뢰도 점수

---

# 🏗 설계 특징

## Aggregate Analysis

개별 리뷰가 아닌 동일 영화의 여러 리뷰를 종합 분석합니다.

## Prompt Version 관리

프롬프트를 코드가 아닌 데이터로 관리하여 운영 중에도 버전 변경이 가능합니다.

## AI Log

AI 요청 및 응답을 저장하여 분석 이력 및 장애 상황을 추적할 수 있습니다.

## Analysis Status

분석 상태를 관리합니다.

- REQUESTED
- ANALYZING
- ANALYZED
- FAILED

---

# 📡 API 명세

## Authentication

| Method | Endpoint     |
| ------ | ------------ |
| POST   | /auth/signup |
| POST   | /auth/login  |
| GET    | /auth/me     |

---

## Review

| Method | Endpoint     |
| ------ | ------------ |
| POST   | /reviews     |
| GET    | /reviews     |
| GET    | /reviews/:id |
| PATCH  | /reviews/:id |
| DELETE | /reviews/:id |

---

## Analysis

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | /analysis/:movieTitle |
| GET    | /analysis/:movieTitle |
| GET    | /analysis             |

---

## Prompt Version

| Method | Endpoint                                   |
| ------ | ------------------------------------------ |
| POST   | /prompt-versions                           |
| GET    | /prompt-versions                           |
| PATCH  | /prompt-versions/:promptVersionId/activate |

---

## AI Log

| Method | Endpoint |
| ------ | -------- |
| GET    | /ai-logs |

---

# 📂 프로젝트 구조

```text
src
├─ auth
├─ user
├─ review
├─ analysis
├─ ai
├─ ai-log
├─ prompt-version
├─ prisma
└─ common
```

---

# 🚀 향후 계획

- Next.js 프론트엔드 개발
- 영화 추천 기능 고도화
- 개인 취향 기반 추천 기능
- 외부 영화 API 연동
- AI 분석 결과 시각화
- 관리자 페이지 구축
