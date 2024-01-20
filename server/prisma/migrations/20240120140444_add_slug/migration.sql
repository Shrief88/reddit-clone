/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Subreddit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Subreddit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subreddit" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subreddit_slug_key" ON "Subreddit"("slug");
