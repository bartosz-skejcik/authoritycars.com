-- Create submissions table
create table submissions (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  phone text not null,
  vehicle_type text not null,
  budget_from numeric not null,
  budget_to numeric not null,
  status_id bigint references statuses,
  assigned_user_id uuid references auth.users,
  is_deleted boolean default false
);

-- Create submission_tags table for many-to-many relationship
create table submission_tags (
  submission_id bigint references submissions on delete cascade,
  tag_id bigint references tags on delete cascade,
  primary key (submission_id, tag_id)
);

-- Create comments table
create table comments (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  submission_id bigint references submissions on delete cascade not null,
  profile_id uuid references profiles not null,
  content text not null
);

-- Create RLS policies
alter table submissions enable row level security;
alter table submission_tags enable row level security;
alter table comments enable row level security;

-- Submissions policies
create policy "Enable read access for authenticated users" on submissions
  for select using (auth.role() = 'authenticated');

create policy "Enable insert access for authenticated users" on submissions
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on submissions
  for update using (auth.role() = 'authenticated');

-- Submission tags policies
create policy "Enable read access for authenticated users" on submission_tags
  for select using (auth.role() = 'authenticated');

create policy "Enable insert access for authenticated users" on submission_tags
  for insert with check (auth.role() = 'authenticated');

create policy "Enable delete access for authenticated users" on submission_tags
  for delete using (auth.role() = 'authenticated');

-- Comments policies
create policy "Enable read access for authenticated users" on comments
  for select using (auth.role() = 'authenticated');

create policy "Enable insert access for authenticated users" on comments
  for insert with check (auth.role() = 'authenticated');

create policy "Enable delete access for owner" on comments
  for delete using (auth.uid() = profile_id);