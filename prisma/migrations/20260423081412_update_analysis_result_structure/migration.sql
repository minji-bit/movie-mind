/*
  Warnings:

  - Added the required column `movie_title` to the `analysis_results` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `sentiment` on the `analysis_results` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AnalysisSentiment" AS ENUM ('POSITIVE', 'NEGATIVE', 'MIXED');

-- DropForeignKey
ALTER TABLE "analysis_results" DROP CONSTRAINT "analysis_results_review_id_fkey";

-- DropIndex
DROP INDEX "analysis_results_review_id_key";

-- AlterTable
ALTER TABLE "analysis_results" ADD COLUMN     "movie_title" TEXT NOT NULL,
ADD COLUMN     "review_count" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "review_id" DROP NOT NULL,
DROP COLUMN "sentiment",
ADD COLUMN     "sentiment" "AnalysisSentiment" NOT NULL;

-- CreateIndex
CREATE INDEX "analysis_results_review_id_idx" ON "analysis_results"("review_id");

-- CreateIndex
CREATE INDEX "analysis_results_movie_title_idx" ON "analysis_results"("movie_title");

-- AddForeignKey
ALTER TABLE "analysis_results" ADD CONSTRAINT "analysis_results_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "movie_reviews"("id") ON DELETE SET NULL ON UPDATE CASCADE;
