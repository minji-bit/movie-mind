-- CreateEnum
CREATE TYPE "ReviewAnalysisStatus" AS ENUM ('CREATED', 'REQUESTED', 'ANALYZING', 'ANALYZED', 'FAILED', 'PERMANENT_FAILED');

-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('CREATED', 'GENERATED', 'FAILED');

-- CreateEnum
CREATE TYPE "AiLogStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "PromptTaskType" AS ENUM ('REVIEW_ANALYSIS', 'REVIEW_RECOMMENDATION');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie_reviews" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "movie_title" TEXT NOT NULL,
    "review_title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" DECIMAL(2,1) NOT NULL,
    "analysis_status" "ReviewAnalysisStatus" NOT NULL,
    "analysis_requested_at" TIMESTAMPTZ(3),
    "analysis_started_at" TIMESTAMPTZ(3),
    "analysis_completed_at" TIMESTAMPTZ(3),
    "analysis_retry_count" INTEGER NOT NULL DEFAULT 0,
    "last_analysis_error" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "movie_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis_results" (
    "id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "keywords_json" JSONB NOT NULL,
    "genre_category" TEXT NOT NULL,
    "mood_category" TEXT NOT NULL,
    "is_spoiler" BOOLEAN NOT NULL,
    "confidence_score" DECIMAL(3,2),
    "raw_result_json" JSONB NOT NULL,
    "prompt_version_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analysis_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "analysis_result_id" TEXT NOT NULL,
    "status" "RecommendationStatus" NOT NULL,
    "recommendation_text" TEXT NOT NULL,
    "reason_text" TEXT NOT NULL,
    "prompt_version_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_logs" (
    "id" TEXT NOT NULL,
    "review_id" TEXT,
    "task_type" "PromptTaskType" NOT NULL,
    "status" "AiLogStatus" NOT NULL,
    "request_payload_json" JSONB NOT NULL,
    "response_payload_json" JSONB,
    "model_name" TEXT NOT NULL,
    "prompt_version_id" TEXT,
    "error_message" TEXT,
    "latency_ms" INTEGER,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_versions" (
    "id" TEXT NOT NULL,
    "task_type" "PromptTaskType" NOT NULL,
    "version" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "system_prompt" TEXT NOT NULL,
    "user_prompt_template" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "movie_reviews_user_id_idx" ON "movie_reviews"("user_id");

-- CreateIndex
CREATE INDEX "movie_reviews_analysis_status_idx" ON "movie_reviews"("analysis_status");

-- CreateIndex
CREATE UNIQUE INDEX "analysis_results_review_id_key" ON "analysis_results"("review_id");

-- CreateIndex
CREATE INDEX "ai_logs_review_id_idx" ON "ai_logs"("review_id");

-- AddForeignKey
ALTER TABLE "movie_reviews" ADD CONSTRAINT "movie_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_results" ADD CONSTRAINT "analysis_results_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "movie_reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_results" ADD CONSTRAINT "analysis_results_prompt_version_id_fkey" FOREIGN KEY ("prompt_version_id") REFERENCES "prompt_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "movie_reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_analysis_result_id_fkey" FOREIGN KEY ("analysis_result_id") REFERENCES "analysis_results"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_prompt_version_id_fkey" FOREIGN KEY ("prompt_version_id") REFERENCES "prompt_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_logs" ADD CONSTRAINT "ai_logs_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "movie_reviews"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_logs" ADD CONSTRAINT "ai_logs_prompt_version_id_fkey" FOREIGN KEY ("prompt_version_id") REFERENCES "prompt_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
