-- =============================================
-- Ideal Builders Checklist — Core Schema
-- =============================================

-- Houses
create table if not exists houses (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slack_channel text,
  drive_search_token text,
  lot_cost     numeric,
  sales_price  numeric,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

-- Checklist template sections
create table if not exists checklist_sections (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  sort_order integer not null default 0
);

-- Checklist items (template + per-house custom)
create table if not exists checklist_items (
  id          uuid primary key default gen_random_uuid(),
  section_id  uuid not null references checklist_sections(id) on delete cascade,
  name        text not null,
  sort_order  integer not null default 0,
  is_template boolean not null default true,
  house_id    uuid references houses(id) on delete cascade
);

-- Actual check state per house × item
create table if not exists checklist_checks (
  id             uuid primary key default gen_random_uuid(),
  house_id       uuid not null references houses(id) on delete cascade,
  item_id        uuid not null references checklist_items(id) on delete cascade,
  checked        boolean not null default false,
  source         text check (source in ('manual','slack')),
  slack_evidence text,
  note           text,
  updated_at     timestamptz not null default now(),
  unique (house_id, item_id)
);

-- Cost template sections
create table if not exists cost_sections (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  sort_order integer not null default 0
);

-- Cost items (template + per-house custom)
create table if not exists cost_items (
  id          uuid primary key default gen_random_uuid(),
  section_id  uuid not null references cost_sections(id) on delete cascade,
  name        text not null,
  sort_order  integer not null default 0,
  is_template boolean not null default true,
  house_id    uuid references houses(id) on delete cascade
);

-- Actual cost amounts per house × cost_item
create table if not exists cost_entries (
  id           uuid primary key default gen_random_uuid(),
  house_id     uuid not null references houses(id) on delete cascade,
  cost_item_id uuid not null references cost_items(id) on delete cascade,
  estimate     numeric,
  paid         numeric,
  updated_at   timestamptz not null default now(),
  unique (house_id, cost_item_id)
);

-- Per-house Drive file exclusions
create table if not exists drive_excluded_files (
  id        uuid primary key default gen_random_uuid(),
  house_id  uuid not null references houses(id) on delete cascade,
  file_id   text not null,
  file_name text,
  unique (house_id, file_id)
);

-- =============================================
-- Row-Level Security (authenticated = full access)
-- =============================================

alter table houses enable row level security;
alter table checklist_sections enable row level security;
alter table checklist_items enable row level security;
alter table checklist_checks enable row level security;
alter table cost_sections enable row level security;
alter table cost_items enable row level security;
alter table cost_entries enable row level security;
alter table drive_excluded_files enable row level security;

create policy "authenticated full access" on houses for all using (auth.role() = 'authenticated');
create policy "authenticated full access" on checklist_sections for all using (auth.role() = 'authenticated');
create policy "authenticated full access" on checklist_items for all using (auth.role() = 'authenticated');
create policy "authenticated full access" on checklist_checks for all using (auth.role() = 'authenticated');
create policy "authenticated full access" on cost_sections for all using (auth.role() = 'authenticated');
create policy "authenticated full access" on cost_items for all using (auth.role() = 'authenticated');
create policy "authenticated full access" on cost_entries for all using (auth.role() = 'authenticated');
create policy "authenticated full access" on drive_excluded_files for all using (auth.role() = 'authenticated');
