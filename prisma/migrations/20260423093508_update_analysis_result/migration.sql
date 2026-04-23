/*
  Warnings:

  - Added the required column `cons_json` to the `analysis_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pros_json` to the `analysis_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendation_text` to the `analysis_results` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "analysis_results" ADD COLUMN     "cons_json" JSONB NOT NULL,
ADD COLUMN     "pros_json" JSONB NOT NULL,
ADD COLUMN     "recommendation_text" TEXT NOT NULL;
