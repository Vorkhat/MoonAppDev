create view "CompletedTaskTypes" as
select u.id, t.type,
       count(ct.id) as count,
       sum(t.reward + t.reward * t.scaling * (
           select count("TaskCompletion".id) from "TaskCompletion" where "TaskCompletion"."userId" = u.id and "TaskCompletion"."taskId" = t.id
       )) as reward
from "User" as u
         left join "TaskCompletion" as ct on ct."userId" = u.id
         left join "Task" as t on t.id = ct."taskId"
group by u.id, t.type;