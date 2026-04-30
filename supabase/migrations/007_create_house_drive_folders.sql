create table if not exists house_drive_folders (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references houses(id) on delete cascade,
  drive_folder_id text not null,
  created_at timestamp with time zone default now()
);

alter table house_drive_folders enable row level security;

create policy "Allow authenticated users to read house drive folders" on house_drive_folders
  for select
  using (true);

create policy "Allow service role to manage house drive folders" on house_drive_folders
  for all
  using (true)
  with check (true);

-- Add unique constraint to ensure one folder per house
create unique index house_drive_folders_house_id_key on house_drive_folders(house_id);
