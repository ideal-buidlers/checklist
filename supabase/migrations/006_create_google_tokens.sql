create table if not exists google_tokens (
  id bigint primary key default 1,
  refresh_token text not null,
  access_token text not null,
  expires_at timestamp with time zone not null,
  updated_at timestamp with time zone default now()
);

alter table google_tokens enable row level security;

create policy "Allow authenticated users to read google tokens" on google_tokens
  for select
  using (true);

create policy "Allow service role to manage google tokens" on google_tokens
  for all
  using (true)
  with check (true);
`