SELECT
  id,
  points,
  row_number() OVER (
    ORDER BY
      points DESC
  ) AS rank
FROM
  "User";