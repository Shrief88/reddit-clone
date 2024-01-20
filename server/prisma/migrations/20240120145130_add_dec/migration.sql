/*
  Warnings:

  - Added the required column `description` to the `Subreddit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subreddit" ADD COLUMN     "description" TEXT NOT NULL;
