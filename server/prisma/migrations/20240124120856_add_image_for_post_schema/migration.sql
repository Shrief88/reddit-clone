-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "image" TEXT,
ALTER COLUMN "content" DROP NOT NULL;
