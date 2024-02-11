/*
  Warnings:

  - The primary key for the `Notification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Notification_pkey" PRIMARY KEY ("senderId", "receiverId", "typeId", "url");
