WITH TYPES AS (
  SELECT
    unnest(enum_range(NULL :: "TaskType")) AS tt
)
SELECT
  u.id,
  TYPES.tt AS TYPE,
  count(ct.id) AS count,
  sum(
    (
      t.reward + (
        (t.reward * t.scaling) * (
          (
            SELECT
              count("TaskCompletion".id) AS count
            FROM
              "TaskCompletion"
            WHERE
              (
                ("TaskCompletion"."userId" = u.id)
                AND ("TaskCompletion"."taskId" = t.id)
              )
          )
        ) :: double precision
      )
    )
  ) AS reward
FROM
  (
    (
      (
        "User" u
        CROSS JOIN TYPES
      )
      LEFT JOIN "TaskCompletion" ct ON ((ct."userId" = u.id))
    )
    LEFT JOIN "Task" t ON ((t.id = ct."taskId"))
  )
GROUP BY
  u.id,
  TYPES.tt;