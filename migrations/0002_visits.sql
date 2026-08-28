create table if not exists visits (
  id text primary key,
  user_id text not null,
  spot_id text not null,
  amount numeric not null,
  points integer not null,
  dog_pln numeric not null default 0,
  dog_id text,
  note text not null default '',
  channel text not null default 'app',
  created_at timestamptz not null default now()
);

create index if not exists visits_user_id_idx on visits (user_id, created_at desc);
