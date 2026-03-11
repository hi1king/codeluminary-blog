-- 启用 UUID 扩展
create extension if not exists "uuid-ossp";

-- profiles 表
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  website text,
  created_at timestamptz default now() not null
);

-- posts 表
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles on delete cascade not null,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null default '',
  cover_url text,
  status text default 'draft' check (status in ('draft', 'published')),
  tags text[] default '{}',
  views integer default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  published_at timestamptz
);

-- 索引
create index posts_slug_idx on public.posts (slug);
create index posts_author_idx on public.posts (author_id);
create index posts_status_idx on public.posts (status);

-- comments 表
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts on delete cascade not null,
  author_id uuid references public.profiles on delete cascade not null,
  parent_id uuid references public.comments on delete cascade,
  content text not null,
  created_at timestamptz default now() not null
);

-- likes 表
create table public.likes (
  post_id uuid references public.posts on delete cascade,
  user_id uuid references public.profiles on delete cascade,
  primary key (post_id, user_id)
);

-- ============ RLS 策略 ============

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;

-- profiles
create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- posts
create policy "Published posts are viewable by everyone"
  on posts for select using (status = 'published');

create policy "Authors can view their own drafts"
  on posts for select using (auth.uid() = author_id);

create policy "Authors can create posts"
  on posts for insert with check (auth.uid() = author_id);

create policy "Authors can update their own posts"
  on posts for update using (auth.uid() = author_id);

create policy "Authors can delete their own posts"
  on posts for delete using (auth.uid() = author_id);

-- comments
create policy "Comments on published posts are viewable"
  on comments for select
  using (exists (
    select 1 from posts
    where posts.id = comments.post_id and posts.status = 'published'
  ));

create policy "Authenticated users can comment"
  on comments for insert with check (auth.uid() = author_id);

create policy "Authors can delete their comments"
  on comments for delete using (auth.uid() = author_id);

-- likes
create policy "Likes are viewable by everyone"
  on likes for select using (true);

create policy "Authenticated users can like"
  on likes for insert with check (auth.uid() = user_id);

create policy "Users can unlike"
  on likes for delete using (auth.uid() = user_id);

-- ============ 自动创建 Profile ============
create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
