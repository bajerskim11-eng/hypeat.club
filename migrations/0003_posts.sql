create table if not exists posts (
  id text primary key,
  user_id text not null,
  author_name text not null,
  author_avatar text,
  spot_id text not null,
  kind text not null,
  caption text not null default '',
  media text,
  points integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists posts_created_idx on posts (created_at desc);
create index if not exists posts_user_idx on posts (user_id, created_at desc);
create index if not exists posts_spot_idx on posts (spot_id, created_at desc);

create table if not exists post_likes (
  post_id text not null,
  user_id text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

insert into posts (id, user_id, author_name, spot_id, kind, caption, media, points, created_at)
values
  (
    'seed-1',
    'seed-ania',
    'Ania',
    'aioli',
    'photo',
    'Brunch na Rynku. Jajka i kawa jak trzeba. Hopla by kiwnęła.',
    '/beboki/receipt-demo.jpg',
    12,
    now() - interval '5 hours'
  ),
  (
    'seed-2',
    'seed-tomek',
    'Tomek',
    'zurownia',
    'review',
    'Żur gęsty, hajer na talerzu. Śląski obiad bez kombinowania. Wracam.',
    null,
    8,
    now() - interval '4 hours'
  ),
  (
    'seed-3',
    'seed-ola',
    'Ola',
    'basiliana',
    'photo',
    'Mariacka wieczorem. Pizza z ogródka, rozmowa do drugiej.',
    '/beboki/ar/street.jpg',
    12,
    now() - interval '3 hours'
  ),
  (
    'seed-4',
    'seed-ania',
    'Ania',
    'byfyj',
    'photo',
    'Po Byfyju kawa z widokiem na familoki. Piesek lokalu zgłosił się sam.',
    '/beboki/dogs/burek.jpg',
    12,
    now() - interval '2 hours'
  ),
  (
    'seed-5',
    'seed-ola',
    'Ola',
    'sztolnia',
    'video',
    'Kadr ze Sztolni — stek i hala kopalni. Pełny klip wrzuciłam na IG.',
    '/beboki/dogs/szarik.jpg',
    20,
    now() - interval '1 hour'
  )
on conflict (id) do nothing;
