/*
  Warnings:

  - Added the required column `language` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CuratedTaskCategory" AS ENUM ('New', 'Daily', 'Sponsored', 'Internal');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('En', 'Ru');

-- DropIndex
DROP INDEX "Task_trackerId_key";

-- AlterTable
ALTER TABLE "Task"
    ADD COLUMN "data" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "TaskTracker"
    ALTER COLUMN "data" SET DEFAULT '{}';

-- AlterTable
ALTER TABLE "User"
    ADD COLUMN "language"   "Language" NOT NULL,
    ADD COLUMN "privileged" BOOLEAN    NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "CuratedTask"
(
    "id"          BIGSERIAL             NOT NULL,
    "category"    "CuratedTaskCategory" NOT NULL,
    "startedAt"   TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "totalReward" DOUBLE PRECISION      NOT NULL,
    "userId"      BIGINT                NOT NULL,
    "taskId"      BIGINT                NOT NULL,

    CONSTRAINT "CuratedTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalizationItem"
(
    "id" BIGSERIAL NOT NULL,

    CONSTRAINT "LocalizationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalizationValue"
(
    "id"       BIGINT     NOT NULL,
    "language" "Language" NOT NULL,
    "value"    TEXT,

    CONSTRAINT "LocalizationValue_pkey" PRIMARY KEY ("id", "language")
);

-- CreateTable
CREATE TABLE "Form"
(
    "id"      BIGSERIAL NOT NULL,
    "titleId" BIGINT    NOT NULL,
    "reward"  DOUBLE PRECISION,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormStep"
(
    "id"                BIGSERIAL NOT NULL,
    "formId"            BIGINT    NOT NULL,
    "content"           JSONB     NOT NULL DEFAULT '[]',
    "defaultStepFormId" BIGINT,
    "order"             INTEGER   NOT NULL,

    CONSTRAINT "FormStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormCompletion"
(
    "id"            BIGSERIAL    NOT NULL,
    "formId"        BIGINT       NOT NULL,
    "userId"        BIGINT       NOT NULL,
    "completedAt"   TIMESTAMP(3),
    "startedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentStepId" BIGINT       NOT NULL,

    CONSTRAINT "FormCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormCompletedStep"
(
    "completionId" BIGINT       NOT NULL,
    "stepId"       BIGINT       NOT NULL,
    "completedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data"         JSONB        NOT NULL DEFAULT '{}',

    CONSTRAINT "FormCompletedStep_pkey" PRIMARY KEY ("completionId", "stepId")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormStep_defaultStepFormId_key" ON "FormStep" ("defaultStepFormId");

-- CreateIndex
CREATE UNIQUE INDEX "FormStep_formId_order_key" ON "FormStep" ("formId", "order");

-- AddForeignKey
ALTER TABLE "CuratedTask"
    ADD CONSTRAINT "CuratedTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuratedTask"
    ADD CONSTRAINT "CuratedTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalizationValue"
    ADD CONSTRAINT "LocalizationValue_id_fkey" FOREIGN KEY ("id") REFERENCES "LocalizationItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form"
    ADD CONSTRAINT "Form_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "LocalizationItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormStep"
    ADD CONSTRAINT "FormStep_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormStep"
    ADD CONSTRAINT "FormStep_defaultStepFormId_fkey" FOREIGN KEY ("defaultStepFormId") REFERENCES "Form" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormCompletion"
    ADD CONSTRAINT "FormCompletion_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormCompletion"
    ADD CONSTRAINT "FormCompletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormCompletion"
    ADD CONSTRAINT "FormCompletion_currentStepId_fkey" FOREIGN KEY ("currentStepId") REFERENCES "FormStep" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormCompletedStep"
    ADD CONSTRAINT "FormCompletedStep_completionId_fkey" FOREIGN KEY ("completionId") REFERENCES "FormCompletion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormCompletedStep"
    ADD CONSTRAINT "FormCompletedStep_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "FormStep" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
