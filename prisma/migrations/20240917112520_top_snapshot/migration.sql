-- CreateTable
CREATE TABLE "TopSnapshot"
(
    "id"        BIGSERIAL    NOT NULL,
    "takenAt"   TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN      NOT NULL DEFAULT false,

    CONSTRAINT "TopSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopSnapshotUser"
(
    "id"     BIGINT           NOT NULL,
    "userId" BIGINT           NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TopSnapshotUser_pkey" PRIMARY KEY ("id", "userId")
);

-- AddForeignKey
ALTER TABLE "TopSnapshotUser"
    ADD CONSTRAINT "TopSnapshotUser_id_fkey" FOREIGN KEY ("id") REFERENCES "TopSnapshot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopSnapshotUser"
    ADD CONSTRAINT "TopSnapshotUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
