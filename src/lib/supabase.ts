import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ===== FORÊT DREAM (sous-ensemble 86 livres) =====

interface DreamForestBook {
  book_id: string
  dream_role: string
  priority: number
  notes: string
  forest_books: {
    id: string
    title: string
    author: string
    main_root: string
    tags: string[]
    concepts: any
  }
}

/**
 * Récupère les livres de la Forêt Dream pertinents pour un contexte donné.
 * Utilise les tags et roots pour matcher avec le contenu du rêve.
 */
export async function queryDreamForest(
  client: SupabaseClient,
  userText: string,
  mode: string,
  limit: number = 5
): Promise<string> {
  // Déterminer quels rôles prioriser selon le mode
  const roleWeights: Record<string, string[]> = {
    dream: ['protocol', 'interpretation', 'archetype', 'safety'],
    day: ['interpretation', 'depth', 'ecology'],
    oracle: ['archetype', 'tradition', 'narrative'],
    tale: ['narrative', 'tradition', 'archetype', 'ecology'],
    forest: [], // Mode forest = forêt globale, pas dream forest
    ritual: ['protocol', 'lucid', 'tradition', 'safety'],
    reentry: ['protocol', 'interpretation', 'lucid', 'safety'],
  }

  const priorityRoles = roleWeights[mode] || ['protocol', 'interpretation']

  if (priorityRoles.length === 0) return '' // Mode forest → forêt globale

  // Récupérer les livres dream avec leurs données forest_books
  const { data: dreamBooks } = await client
    .from('dream_forest_books')
    .select(`
      book_id, dream_role, priority, notes,
      forest_books!inner (id, title, author, main_root, tags, concepts)
    `)
    .in('dream_role', priorityRoles)
    .order('priority', { ascending: true })
    .limit(30)

  if (!dreamBooks || dreamBooks.length === 0) return ''

  // Scoring simple : match tags/concepts du livre avec mots du rêve
  const words = userText.toLowerCase().split(/\s+/)
  const scored = (dreamBooks as any[]).map((db: any) => {
    const book = db.forest_books
    const tags = (book.tags || []).map((t: string) => t.toLowerCase())
    const conceptKeys = book.concepts ? Object.keys(book.concepts).map((c: string) => c.toLowerCase()) : []

    let score = 0
    // Priorité du livre dans dream forest
    score += (4 - db.priority) * 3
    // Rôle en première position = bonus
    if (db.dream_role === priorityRoles[0]) score += 5
    // Match mots du rêve avec tags
    for (const word of words) {
      if (word.length < 4) continue
      if (tags.some((t: string) => t.includes(word))) score += 2
      if (conceptKeys.some((c: string) => c.includes(word))) score += 3
    }

    return { ...db, book, score }
  })

  // Trier par score et prendre les meilleurs
  scored.sort((a: any, b: any) => b.score - a.score)
  const topBooks = scored.slice(0, limit)

  // Formater en contexte lisible pour le system prompt
  return topBooks.map((b: any) => {
    const concepts = b.book.concepts
      ? Object.entries(b.book.concepts).slice(0, 3).map(([k, v]: [string, any]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`).join('; ')
      : ''
    return `📖 **${b.book.title}** (${b.book.author}) [${b.dream_role}]\n   ${b.notes}\n   ${concepts ? `Concepts: ${concepts}` : ''}`
  }).join('\n\n')
}

// ===== FORÊT GLOBALE (249+ livres) =====

/**
 * Consultation profonde de la Forêt complète.
 * Utilisé en mode 'forest' — recherche sémantique sur toute la bibliothèque.
 */
export async function queryGlobalForest(
  client: SupabaseClient,
  userText: string,
  limit: number = 8
): Promise<string> {
  const words = userText.toLowerCase().split(/\s+/).filter(w => w.length >= 4)

  // Chercher par tags et roots
  const { data: books } = await client
    .from('forest_books')
    .select('id, title, author, main_root, secondary_roots, tags, concepts, ethical_notes')
    .limit(249)

  if (!books || books.length === 0) return ''

  // Scoring sémantique
  const scored = books.map(book => {
    let score = 0
    const allTags = [...(book.tags || []), book.main_root, ...(book.secondary_roots || [])]
      .map((t: string) => t?.toLowerCase() || '')
    const conceptKeys = book.concepts ? Object.keys(book.concepts).map(c => c.toLowerCase()) : []

    for (const word of words) {
      if (allTags.some(t => t.includes(word))) score += 2
      if (conceptKeys.some(c => c.includes(word))) score += 3
      if (book.title?.toLowerCase().includes(word)) score += 4
      if (book.author?.toLowerCase().includes(word)) score += 3
    }

    return { ...book, score }
  })

  scored.sort((a, b) => b.score - a.score)
  const topBooks = scored.filter(b => b.score > 0).slice(0, limit)

  if (topBooks.length === 0) {
    // Fallback : retourner les plus consultés ou les plus importants
    const fallback = books.slice(0, 5)
    return fallback.map(b =>
      `📖 **${b.title}** (${b.author}) — Root: ${b.main_root}`
    ).join('\n')
  }

  return topBooks.map(b => {
    const concepts = b.concepts
      ? Object.entries(b.concepts).slice(0, 4).map(([k, v]: [string, any]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`).join('; ')
      : ''
    const ethical = b.ethical_notes ? `\n   ⚠️ ${b.ethical_notes}` : ''
    return `📖 **${b.title}** (${b.author}) [${b.main_root}]\n   Tags: ${(b.tags || []).slice(0, 8).join(', ')}\n   ${concepts ? `Concepts: ${concepts}` : ''}${ethical}`
  }).join('\n\n')
}

// ===== PERSONAL FOREST (dictionnaire symbolique personnel) =====

interface PersonalSymbol {
  symbol: string
  category: string
  occurrences: number
  associations: string[]
  first_seen: string
  last_seen: string
  evolution_notes: string
}

/**
 * Met à jour la Personal Forest avec les entités extraites d'un rêve.
 * Crée de nouveaux symboles ou renforce les existants.
 * Colonnes réelles : id, name, category, description, occurrence_count,
 *   first_seen_at, last_seen_at, dream_ids, evolution_notes, associations,
 *   user_id, created_at, updated_at
 */
export async function updatePersonalForest(
  client: SupabaseClient,
  userId: string,
  entities: any,
  dreamId: string
): Promise<void> {
  if (!entities) return

  const now = new Date().toISOString()

  // Extraire les symboles des entités (format flexible)
  const symbols: { name: string; category: string }[] = []
  const entityFields: [string, string][] = [
    ['characters', 'character'],
    ['places', 'place'],
    ['objects', 'object'],
    ['emotions', 'emotion'],
    ['themes', 'theme'],
    ['actions', 'action'],
  ]

  for (const [field, category] of entityFields) {
    if (entities[field] && Array.isArray(entities[field])) {
      for (const item of entities[field]) {
        const name = typeof item === 'string' ? item : item.name || String(item)
        if (name) symbols.push({ name, category })
      }
    }
  }

  for (const sym of symbols) {
    const symbolName = sym.name.toLowerCase().trim()
    if (!symbolName || symbolName.length < 2) continue

    // Chercher si ce symbole existe déjà pour cet utilisateur
    const { data: existing } = await client
      .from('personal_forest')
      .select('*')
      .eq('user_id', userId)
      .eq('name', symbolName)
      .limit(1)

    if (existing && existing.length > 0) {
      // Renforcer le symbole existant
      const current = existing[0]
      const dreamIds = current.dream_ids || []
      if (!dreamIds.includes(dreamId)) dreamIds.push(dreamId)

      await client
        .from('personal_forest')
        .update({
          occurrence_count: (current.occurrence_count || 0) + 1,
          dream_ids: dreamIds,
          last_seen_at: now,
          updated_at: now,
        })
        .eq('id', current.id)
    } else {
      // Créer un nouveau symbole personnel
      await client
        .from('personal_forest')
        .insert({
          user_id: userId,
          name: symbolName,
          category: sym.category,
          description: '',
          occurrence_count: 1,
          dream_ids: [dreamId],
          first_seen_at: now,
          last_seen_at: now,
          associations: {},
          evolution_notes: '',
        })
    }
  }
}

/**
 * Récupère la Personal Forest d'un utilisateur pour enrichir le contexte.
 */
export async function getPersonalForest(
  client: SupabaseClient,
  userId: string,
  limit: number = 20
): Promise<string> {
  const { data: symbols } = await client
    .from('personal_forest')
    .select('name, category, occurrence_count, first_seen_at, last_seen_at')
    .eq('user_id', userId)
    .order('occurrence_count', { ascending: false })
    .limit(limit)

  if (!symbols || symbols.length === 0) return ''

  return '## Ta carte symbolique personnelle\n' + symbols.map(s => {
    const freq = s.occurrence_count > 5 ? '🔥' : s.occurrence_count > 2 ? '✨' : '🌱'
    return `${freq} **${s.name}** (${s.category}) — ${s.occurrence_count}× depuis ${new Date(s.first_seen_at).toLocaleDateString('fr-FR')}`
  }).join('\n')
}
