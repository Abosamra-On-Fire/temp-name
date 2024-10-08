/*
  Warnings:

  - The primary key for the `Story` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `last_seen` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePic` on the `User` table. All the data in the column will be lost.
  - Added the required column `profilPic` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `bio` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Story" DROP CONSTRAINT "Story_pkey",
DROP COLUMN "created_at",
ADD CONSTRAINT "Story_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "last_seen",
DROP COLUMN "profilePic",
ADD COLUMN     "profilPic" TEXT NOT NULL,
ALTER COLUMN "bio" SET NOT NULL;
