const url = process.env.SUPABASE_URL?.replace(/\/$/, '')
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function config() {
  if (!url || !serviceRoleKey) throw new Error('Supabase server credentials are not configured')
  return { url, key: serviceRoleKey }
}

export async function supabaseRpc<T>(name: string, body: Record<string, unknown>): Promise<T> {
  const { url, key } = config()
  const response = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Supabase RPC failed: ${response.status}`)
  return response.json() as Promise<T>
}

export async function ensureConversation(id: string) {
  const { url, key } = config()
  const response = await fetch(`${url}/rest/v1/doma_conversations`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify({ id }),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Supabase conversation failed: ${response.status}`)
}

export async function insertConversationMessage(input: {
  conversationId: string
  role: 'user' | 'assistant'
  content: string
}) {
  const { url, key } = config()
  const response = await fetch(`${url}/rest/v1/doma_conversation_messages`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ conversation_id: input.conversationId, role: input.role, content: input.content }),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Supabase insert failed: ${response.status}`)
}

export type StoredConversationMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type StoredProjectLead = {
  name: string | null
  phone: string | null
  budget: string | null
  project_type: string | null
  project_details: string | null
}

export async function getConversationMessages(conversationId: string, limit = 24) {
  const { url, key } = config()
  const params = new URLSearchParams({
    select: 'role,content',
    conversation_id: `eq.${conversationId}`,
    order: 'created_at.desc,id.desc',
    limit: String(limit),
  })
  const response = await fetch(`${url}/rest/v1/doma_conversation_messages?${params}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Supabase conversation history failed: ${response.status}`)
  const messages = await response.json() as StoredConversationMessage[]
  return messages.reverse()
}

export async function getProjectLead(conversationId: string) {
  const { url, key } = config()
  const params = new URLSearchParams({
    select: 'name,phone,budget,project_type,project_details',
    conversation_id: `eq.${conversationId}`,
    limit: '1',
  })
  const response = await fetch(`${url}/rest/v1/doma_leads?${params}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Supabase lead read failed: ${response.status}`)
  const leads = await response.json() as StoredProjectLead[]
  return leads[0] ?? null
}

export async function upsertProjectLead(input: {
  conversationId: string
  name?: string
  phone?: string
  budget?: string
  projectType?: string
  projectDetails?: string
}) {
  const { url, key } = config()
  const lead = {
    conversation_id: input.conversationId,
    ...(input.name ? { name: input.name } : {}),
    ...(input.phone ? { phone: input.phone } : {}),
    ...(input.budget ? { budget: input.budget } : {}),
    ...(input.projectType ? { project_type: input.projectType } : {}),
    ...(input.projectDetails ? { project_details: input.projectDetails } : {}),
    updated_at: new Date().toISOString(),
  }
  const response = await fetch(`${url}/rest/v1/doma_leads?on_conflict=conversation_id`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(lead),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Supabase lead upsert failed: ${response.status}`)
}

export function createConversationId(value: unknown) {
  return typeof value === 'string' && /^[a-zA-Z0-9_-]{8,100}$/.test(value) ? value : crypto.randomUUID()
}

export function supabaseIsConfigured() {
  return Boolean(url && serviceRoleKey)
}

export function safeLog(event: string, fields: Record<string, unknown> = {}) {
  console.info(`[doma] ${event}`, fields)
}

export function safeError(event: string) {
  console.error(`[doma] ${event}`)
}
