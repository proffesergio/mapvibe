-- Additive VibeMap directory schema. Run in Neon SQL Editor before enabling submissions.
create extension if not exists pg_trgm;
create table if not exists directory_tools (
  id bigserial primary key,
  name text not null check (char_length(name) between 2 and 100),
  description text not null check (char_length(description) between 10 and 1000),
  url text not null,
  canonical_url text not null unique,
  district_id text not null,
  category text not null check (category in ('AI', 'Productivity', 'Developer tools', 'Design', 'Education', 'Other')),
  stack text[] not null default '{}',
  carbon_copy boolean not null default false,
  carbon_copy_evidence jsonb,
  created_at timestamptz not null default now()
);

create index if not exists directory_tools_created_idx on directory_tools (created_at desc, id desc);
create index if not exists directory_tools_category_created_idx on directory_tools (category, created_at desc, id desc);
create index if not exists directory_tools_district_created_idx on directory_tools (district_id, created_at desc, id desc);
create index if not exists directory_tools_name_search_idx on directory_tools using gin (name gin_trgm_ops);
create index if not exists directory_tools_description_search_idx on directory_tools using gin (description gin_trgm_ops);

create index if not exists directory_tools_stack_idx on directory_tools using gin (stack);
create index if not exists directory_tools_copy_created_idx on directory_tools (created_at desc, id desc) where carbon_copy;
