-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies for profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Create categories table
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies for categories
alter table public.categories enable row level security;
create policy "Users can view own categories" on public.categories for select using (auth.uid() = user_id);
create policy "Users can create own categories" on public.categories for insert with check (auth.uid() = user_id);
create policy "Users can update own categories" on public.categories for update using (auth.uid() = user_id);
create policy "Users can delete own categories" on public.categories for delete using (auth.uid() = user_id);

-- Create transactions table
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  amount decimal(12,2) not null,
  description text,
  date date not null,
  type text not null check (type in ('income', 'expense')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies for transactions
alter table public.transactions enable row level security;
create policy "Users can view own transactions" on public.transactions for select using (auth.uid() = user_id);
create policy "Users can create own transactions" on public.transactions for insert with check (auth.uid() = user_id);
create policy "Users can update own transactions" on public.transactions for update using (auth.uid() = user_id);
create policy "Users can delete own transactions" on public.transactions for delete using (auth.uid() = user_id);

-- Create subscriptions table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  amount decimal(12,2) not null,
  billing_cycle text not null check (billing_cycle in ('monthly', 'yearly', 'quarterly')),
  next_billing_date date not null,
  category_id uuid references public.categories(id) on delete set null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text not null check (status in ('active', 'cancelled', 'paused')) default 'active'
);

-- Create RLS policies for subscriptions
alter table public.subscriptions enable row level security;
create policy "Users can view own subscriptions" on public.subscriptions for select using (auth.uid() = user_id);
create policy "Users can create own subscriptions" on public.subscriptions for insert with check (auth.uid() = user_id);
create policy "Users can update own subscriptions" on public.subscriptions for update using (auth.uid() = user_id);
create policy "Users can delete own subscriptions" on public.subscriptions for delete using (auth.uid() = user_id);

-- Create budgets table
create table public.budgets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete cascade not null,
  amount decimal(12,2) not null,
  period text not null check (period in ('monthly', 'yearly')),
  start_date date not null,
  end_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies for budgets
alter table public.budgets enable row level security;
create policy "Users can view own budgets" on public.budgets for select using (auth.uid() = user_id);
create policy "Users can create own budgets" on public.budgets for insert with check (auth.uid() = user_id);
create policy "Users can update own budgets" on public.budgets for update using (auth.uid() = user_id);
create policy "Users can delete own budgets" on public.budgets for delete using (auth.uid() = user_id);

-- Create tax_documents table
create table public.tax_documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  document_url text not null,
  tax_year integer not null,
  category text not null check (category in ('w2', '1099', 'receipt', 'other')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies for tax_documents
alter table public.tax_documents enable row level security;
create policy "Users can view own tax documents" on public.tax_documents for select using (auth.uid() = user_id);
create policy "Users can create own tax documents" on public.tax_documents for insert with check (auth.uid() = user_id);
create policy "Users can update own tax documents" on public.tax_documents for update using (auth.uid() = user_id);
create policy "Users can delete own tax documents" on public.tax_documents for delete using (auth.uid() = user_id);

-- Create functions to handle user management
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 