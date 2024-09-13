/*
  Warnings:

  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User"
    ADD COLUMN "name" TEXT NOT NULL;

drop view "UsersTop";

create view "UsersTop" as
select id,
       name,
       points,
       row_number() over (order by points desc) as rank
from "User"
order by rank;
