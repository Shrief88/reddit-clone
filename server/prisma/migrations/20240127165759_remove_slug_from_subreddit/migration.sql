/*
  Warnings:

  - You are about to drop the column `slug` on the `Subreddit` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Subreddit_slug_key";

-- AlterTable
ALTER TABLE "Subreddit" DROP COLUMN "slug";
