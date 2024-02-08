/*
  Warnings:

  - You are about to drop the column `description` on the `NotificationType` table. All the data in the column will be lost.
  - Added the required column `message` to the `NotificationType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NotificationType" DROP COLUMN "description",
ADD COLUMN     "message" TEXT NOT NULL;
