/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `NotificationType` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `name` on the `NotificationType` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "NotificationTypeNames" AS ENUM ('post_upvote', 'post_comment', 'comment_upvote', 'comment_reply', 'account_follow');

-- AlterTable
ALTER TABLE "NotificationType" DROP COLUMN "name",
ADD COLUMN     "name" "NotificationTypeNames" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "NotificationType_name_key" ON "NotificationType"("name");
