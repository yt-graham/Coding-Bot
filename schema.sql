create table if not exists scores (
  id bigserial primary key,
  config text not null,
  time_seconds integer not null check (time_seconds >= 0 and time_seconds <= 999),
  name text,
  created_at timestamptz not null default now()
);

create index if not exists scores_config_time_idx on scores (config, time_seconds);
create index if not exists scores_config_created_idx on scores (config, created_at);
