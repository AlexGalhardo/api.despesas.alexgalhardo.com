/*
  Warnings:

  - You are about to drop the column `asaas_customer_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `asaas_customer_response` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `subscription_ends_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `subscription_starts_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `subscription_tier_basic` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `subscription_tier_free` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `subscription_tier_pro` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_asaas_customer_id_key";

-- DropIndex
DROP INDEX "users_asaas_customer_response_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "asaas_customer_id",
DROP COLUMN "asaas_customer_response",
DROP COLUMN "subscription_ends_at",
DROP COLUMN "subscription_starts_at",
DROP COLUMN "subscription_tier_basic",
DROP COLUMN "subscription_tier_free",
DROP COLUMN "subscription_tier_pro";
