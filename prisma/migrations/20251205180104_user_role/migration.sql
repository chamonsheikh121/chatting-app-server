-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('User', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRoles" NOT NULL DEFAULT 'User';
