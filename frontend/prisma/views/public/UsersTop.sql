-- todo make it materialized later for prod
-- todo add cron job to refresh materialized view
create view "UsersTop" as
    select id, points,
           row_number() over (order by points desc) as rank
    from "User";