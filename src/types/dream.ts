export type Dream = {
  id: string
  title: string | null
  raw_text: string
  audio_url: string | null
  source: 'text' | 'voice' | 'transcription'
  dream_date: string
  mood: string | null
  tags: string[]
  notes: string | null
  entities: Record<string, any> | null
  patterns: Record<string, any> | null
  prophetic_suspect: boolean
  created_at: string
  updated_at: string
}

export type Conversation = {
  id: string
  dream_id: string
  role: 'user' | 'assistant'
  content: string
  model_used: string | null
  mode: string | null
  created_at: string
}

export type Message = {
  role: 'user' | 'assistant'
  content: string
}

export type PersonalForestEntity = {
  id: string
  name: string
  category: string
  description: string | null
  occurrence_count: number
  first_seen_at: string
  last_seen_at: string
  dream_ids: string[]
  evolution_notes: string | null
  associations: Record<string, any>
}
