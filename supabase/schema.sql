create extension if not exists vector;

create table if not exists public.doma_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  storage_path text not null unique,
  category text not null,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.doma_knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.doma_documents(id) on delete cascade,
  content text not null,
  embedding vector(1536) not null,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists doma_knowledge_chunks_embedding_idx
on public.doma_knowledge_chunks using hnsw (embedding vector_cosine_ops);

create table if not exists public.doma_conversations (
  id text primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.doma_leads (
  id uuid primary key default gen_random_uuid(),
  conversation_id text not null unique references public.doma_conversations(id) on delete cascade,
  name text check (char_length(name) <= 200),
  phone text check (char_length(phone) <= 50),
  budget text check (char_length(budget) <= 200),
  project_type text check (char_length(project_type) <= 200),
  project_details text check (char_length(project_details) <= 3000),
  status text not null default 'nuevo' check (status in ('nuevo', 'contactado', 'calificado', 'cerrado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.doma_leads alter column project_type drop default;
alter table public.doma_leads alter column project_type drop not null;

create table if not exists public.doma_conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id text not null references public.doma_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(content) <= 10000),
  created_at timestamptz not null default now()
);

create or replace function public.match_doma_knowledge(
  query_embedding vector(1536),
  match_threshold float default 0.72,
  match_count int default 6
)
returns table (chunk_id uuid, content text, metadata jsonb, similarity float)
language sql stable
set search_path = public
as $$
  select c.id, c.content,
    c.metadata || jsonb_build_object('document_title', d.title, 'category', d.category, 'storage_path', d.storage_path),
    1 - (c.embedding <=> query_embedding) as similarity
  from public.doma_knowledge_chunks c
  join public.doma_documents d on d.id = c.document_id
  where 1 - (c.embedding <=> query_embedding) >= match_threshold
  order by c.embedding <=> query_embedding
  limit least(greatest(match_count, 1), 12);
$$;

alter table public.doma_documents enable row level security;
alter table public.doma_knowledge_chunks enable row level security;
alter table public.doma_conversations enable row level security;
alter table public.doma_leads enable row level security;
alter table public.doma_conversation_messages enable row level security;
revoke all on public.doma_documents, public.doma_knowledge_chunks, public.doma_conversations, public.doma_leads, public.doma_conversation_messages from anon, authenticated;
grant all on public.doma_documents, public.doma_knowledge_chunks, public.doma_conversations, public.doma_leads, public.doma_conversation_messages to service_role;
grant execute on function public.match_doma_knowledge(vector, double precision, integer) to service_role;

insert into storage.buckets (id, name, public)
values ('doma-documents', 'doma-documents', false)
on conflict (id) do nothing;
