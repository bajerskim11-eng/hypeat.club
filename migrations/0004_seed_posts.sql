insert into posts (id, user_id, author_name, spot_id, kind, caption, media, points)
values
  ('seed-1', 'seed-ania', 'Ania', 'aioli', 'photo', 'Brunch na Rynku. Jajka i kawa jak trzeba.', '/beboki/receipt-demo.jpg', 12),
  ('seed-2', 'seed-tomek', 'Tomek', 'zurownia', 'review', 'Żur gęsty, hajer na talerzu. Śląski obiad bez kombinowania.', null, 8),
  ('seed-3', 'seed-ola', 'Ola', 'basiliana', 'photo', 'Mariacka wieczorem. Pizza z ogródka.', '/beboki/ar/street.jpg', 12),
  ('seed-4', 'seed-ania', 'Ania', 'byfyj', 'photo', 'Po Byfyju kawa i familoki. Piesek lokalu zgłosił się sam.', '/beboki/dogs/burek.jpg', 12),
  ('seed-5', 'seed-ola', 'Ola', 'sztolnia', 'video', 'Kadr ze Sztolni. Pełny klip poszło na IG.', '/beboki/dogs/szarik.jpg', 20)
on conflict (id) do nothing;
