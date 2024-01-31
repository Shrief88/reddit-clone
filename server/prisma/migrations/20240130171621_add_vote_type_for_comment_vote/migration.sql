/*
  Warnings:

  - Added the required column `type` to the `CommentVote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommentVote" ADD COLUMN     "type" "VoteType" NOT NULL;
