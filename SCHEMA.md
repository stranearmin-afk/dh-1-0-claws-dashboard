# Database Schema

Execute this SQL in Supabase SQL Editor:

```sql
create table agents (
  id text primary key,
  name text not null,
  status text check (status in ('idle', 'running', 'error')) default 'idle',
  current_job text,
  last_heartbeat bigint,
  config_json jsonb default '{}',
  created_at timestamp default now()
);

create table connections (
  id uuid default gen_random_uuid() primary key,
  service_name text not null,
  service_type text not null,
  api_key_encrypted text,
  initial_balance numeric default 0,
  estimated_usage numeric default 0,
  status text default 'unknown',
  last_check bigint,
  metadata jsonb default '{}',
  created_at timestamp default now()
);

create table usage_logs (
  id uuid default gen_random_uuid() primary key,
  connection_id uuid references connections(id),
  request_type text,
  input_tokens integer,
  output_tokens integer,
  cost_usd numeric,
  timestamp bigint default extract(epoch from now())
);

alter table agents enable row level security;
alter table connections enable row level security;
alter table usage_logs enable row level security;
create policy "Allow all" on agents for all using (true) with check (true);
create policy "Allow all" on connections for all using (true) with check (true);
create policy "Allow all" on usage_logs for all using (true) with check (true);
```
