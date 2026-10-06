-- MapVibe public slang DB (Neon Postgres)
-- Run once in Neon SQL Editor, then set DATABASE_URL in .env.local
-- Falls back to local dataset when DATABASE_URL is missing.

create table if not exists slangs (
  id bigserial primary key,
  phrase text not null check (char_length(phrase) between 1 and 80),
  meaning text not null check (char_length(meaning) between 1 and 160),
  example text not null default '' check (char_length(example) <= 200),
  division text not null default '',
  district_id text not null default 'dhaka',
  upazila text not null default '',
  contributor text not null default 'বেনামি',
  upvotes integer not null default 0,
  reports integer not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists slangs_district_idx on slangs (district_id);
create index if not exists slangs_upvotes_idx on slangs (upvotes desc);
create index if not exists slangs_created_idx on slangs (created_at desc);

-- Seed a few starter rows (matches src/data/slangs.js ids s1..s12 loosely)
insert into slangs (phrase, meaning, district_id, contributor) values
  ('উড়া ধুরা', 'চরম / পাগলাটে', 'dhaka', 'mapvibe'),
  ('হ্যারিকেন ধরানো', 'বড় বিপদে পড়া', 'dhaka', 'mapvibe'),
  ('বেগুনী (হ্যাঁ/না টান)', 'কুমিল্লার আঞ্চলিক টান', 'cumilla', 'mapvibe'),
  ('ক্যাঁতাশ / হাতাশ', 'বিরক্তির অভিব্যক্তি', 'noakhali', 'mapvibe'),
  ('মেইল্লা দিউম / থেঁতলাই দিউম', 'মজার ভয় দেখানো', 'chattogram', 'mapvibe'),
  ('বাইসাব / পুরী', 'ভাই / মেয়ে', 'sylhet', 'mapvibe')
on conflict do nothing;
