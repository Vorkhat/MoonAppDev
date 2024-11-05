DROP VIEW IF EXISTS "CompletedTaskTypes";

CREATE VIEW "CompletedTaskTypes" AS
WITH types AS (
    SELECT unnest(enum_range(NULL::"TaskType")) AS tt
),
     unique_task_completions AS (
         SELECT DISTINCT "userId", "taskId"
         FROM "TaskCompletion"
     )
SELECT
    u.id,
    tt AS type,
    COUNT(ct."taskId") AS count,
    SUM(
            CASE
                WHEN t.type = tt THEN t.reward * (1 + (t.scaling * GREATEST(
                        (SELECT COUNT(1) FROM "TaskCompletion"
                         WHERE "TaskCompletion"."userId" = u.id
                           AND "TaskCompletion"."taskId" = t.id) - 1, 0)))
                ELSE 0
                END
    ) AS reward
FROM
    "User" AS u
        CROSS JOIN
    types
        LEFT JOIN
    unique_task_completions AS ct ON ct."userId" = u.id
        LEFT JOIN
    "Task" AS t ON t.id = ct."taskId"
GROUP BY
    u.id, tt;
