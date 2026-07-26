-- Dream Alpha — Schéma Supabase
-- Exécuter dans le SQL Editor de Supabase Dashboard

-- Extension UUID
create extension if not exists "uuid-ossp";

-- ============================================
-- Table: dreams
-- ============================================
create table if not exists dreams (
  id uuid default uuid_generate_v4() primary key,

  -- Contenu
  title text,
  raw_text text not null,
  audio_url text,
  source text default 'text' check (source in ('text', 'voice', 'transcription', 'oracle', 'journal')),
  entry_type text default 'dream' check (entry_type in ('dream', 'day', 'oracle', 'tale', 'forest')),
  oracle_data jsonb default null, -- données spécifiques tirage (cartes, positions, deck)

  -- Métadonnées rêve
  dream_date date default current_date,
  mood text, -- felt sense global
  tags text[] default '{}',
  notes text, -- notes personnelles post-conversation

  -- Intelligence (rempli par Haiku/Sonnet)
  entities jsonb default '{}',
  patterns jsonb default '{}',
  prophetic_suspect boolean default false,

  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- Table: conversations
-- Messages de conversation liés à un rêve
-- ============================================
create table if not exists conversations (
  id uuid default uuid_generate_v4() primary key,
  dream_id uuid references dreams(id) on delete cascade,

  role text not null check (role in ('user', 'assistant')),
  content text not null,

  -- Metadata optionnelle
  model_used text, -- 'haiku', 'sonnet', 'opus'
  mode text, -- 'conversation', 'deep_exploration', 'reentry'

  created_at timestamptz default now()
);

-- ============================================
-- Table: personal_forest
-- Forêt personnelle de l'utilisateur (entités récurrentes)
-- ============================================
create table if not exists personal_forest (
  id uuid default uuid_generate_v4() primary key,

  -- Entité
  name text not null,
  category text not null check (category in ('person', 'place', 'object', 'situation', 'emotion', 'animal', 'plant', 'threshold', 'symbol')),
  description text,

  -- Stats
  occurrence_count integer default 1,
  first_seen_at timestamptz default now(),
  last_seen_at timestamptz default now(),
  dream_ids uuid[] default '{}',

  -- Intelligence
  evolution_notes text, -- comment cette entité évolue au fil des rêves
  associations jsonb default '{}', -- liens avec d'autres entités

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- Index pour performance
-- ============================================
create index if not exists idx_dreams_created_at on dreams(created_at desc);
create index if not exists idx_dreams_dream_date on dreams(dream_date desc);
create index if not exists idx_dreams_entry_type on dreams(entry_type);
create index if not exists idx_dreams_prophetic on dreams(prophetic_suspect) where prophetic_suspect = true;
create index if not exists idx_conversations_dream_id on conversations(dream_id);
create index if not exists idx_personal_forest_category on personal_forest(category);
create index if not exists idx_personal_forest_name on personal_forest(name);

-- ============================================
-- Full-text search sur les rêves
-- ============================================
alter table dreams add column if not exists fts tsvector
  generated always as (to_tsvector('french', coalesce(title, '') || ' ' || coalesce(raw_text, ''))) stored;

create index if not exists idx_dreams_fts on dreams using gin(fts);

-- ============================================
-- RLS (Row Level Security) — désactivé pour solo
-- À activer quand on ajoutera des users
-- ============================================
-- alter table dreams enable row level security;
-- alter table conversations enable row level security;
-- alter table personal_forest enable row level security;
