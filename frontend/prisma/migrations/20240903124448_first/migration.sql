-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('Comment', 'Task', 'Game', 'Invite');

-- CreateTable
CREATE TABLE "User" (
    "id" BIGINT NOT NULL,
    "points" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" BIGSERIAL NOT NULL,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" BIGSERIAL NOT NULL,
    "type" "TaskType" NOT NULL,
    "url" TEXT NOT NULL,
    "trackerId" BIGINT NOT NULL,
    "reward" DOUBLE PRECISION NOT NULL,
    "scaling" DOUBLE PRECISION NOT NULL DEFAULT 1,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskCompletion" (
    "id" BIGSERIAL NOT NULL,
    "taskId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Task_trackerId_key" ON "Task"("trackerId");

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskCompletion" ADD CONSTRAINT "TaskCompletion_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskCompletion" ADD CONSTRAINT "TaskCompletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

create view "UsersTop" as
select id, points,
       row_number() over (order by points desc) as rank
from "User";

create view "CompletedTaskTypes" as
with types as (
    select unnest(enum_range(NULL::"TaskType")) as tt
)
select u.id, tt as type,
       count(ct.id) as count,
       sum(t.reward + t.reward * t.scaling * (
           select count("TaskCompletion".id) from "TaskCompletion" where "TaskCompletion"."userId" = u.id and "TaskCompletion"."taskId" = t.id
       )) as reward
from "User" as u
         cross join types
         left join "TaskCompletion" as ct on ct."userId" = u.id
         left join "Task" as t on t.id = ct."taskId"
group by u.id, tt;
