-- CreateTable
CREATE TABLE "TaskTracker"
(
    "id"   BIGSERIAL NOT NULL,
    "data" JSONB     NOT NULL,

    CONSTRAINT "TaskTracker_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task"
    ADD CONSTRAINT "Task_trackerId_fkey" FOREIGN KEY ("trackerId") REFERENCES "TaskTracker" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
