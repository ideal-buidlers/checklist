-- Create table to track Slack file uploads to Drive
create table if not exists slack_file_uploads (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references houses(id) on delete cascade,
  slack_file_id text not null,
  slack_channel text not null,
  drive_file_id text not null,
  file_name text not null,
  uploaded_at timestamp with time zone default now(),
  unique(slack_file_id)
);

alter table slack_file_uploads enable row level security;

create policy "Allow authenticated users to read slack file uploads" on slack_file_uploads
  for select
  using (true);

create policy "Allow service role to manage slack file uploads" on slack_file_uploads
  for all
  using (true)
  with check (true);

-- Add index for faster lookups
create index slack_file_uploads_house_id_idx on slack_file_uploads(house_id);
create index slack_file_uploads_slack_file_id_idx on slack_file_uploads(slack_file_id);
