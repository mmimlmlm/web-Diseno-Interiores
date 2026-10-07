import { NextResponse } from 'next/server'
import { createEmbedding } from '../../../../lib/openai'
import { domaCatalog } from '../../../../lib/doma-catalog'

export const runtime = 'nodejs'

function adminAuthorized(request: Request) {
  const expected = process.env.DOMA_ADMIN_KEY
  const provided = request.headers.get('x-doma-admin-key')
  return Boolean(expected && provided && provided === expected)
}

export async function POST(request: Request) {
  if (!adminAuthorized(request)) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  try {
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('Supabase no configurado')
    const body = await request.json().catch(() => ({})) as { entries?: unknown }
    const entries = Array.isArray(body.entries) ? body.entries : domaCatalog
    const documents: string[] = []
    for (const entry of entries) {
      if (!entry || typeof entry !== 'object') continue
      const item = entry as typeof domaCatalog[number]
      if (!item.title || !item.content || !item.category) continue
      const documentResponse = await fetch(`${SUPABASE_URL}/rest/v1/doma_documents`, {
        method: 'POST', headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({ title: item.title, storage_path: `admin/${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, category: item.category, metadata: item.metadata ?? {} }),
      })
      const document = await documentResponse.json() as Array<{ id: string }>
      const documentId = document[0]?.id
      if (!documentId && documentResponse.status !== 409) continue
      if (!documentId) continue
      const embedding = await createEmbedding(item.content)
      const chunkResponse = await fetch(`${SUPABASE_URL}/rest/v1/doma_knowledge_chunks`, {
        method: 'POST', headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ document_id: documentId, content: item.content, embedding, metadata: item.metadata ?? {} }),
      })
      if (chunkResponse.ok) documents.push(item.title)
    }
    return NextResponse.json({ inserted: documents })
  } catch (error) {
    console.error('[doma] knowledge_seed_failed', error instanceof Error ? error.message : 'unknown')
    return NextResponse.json({ error: 'No fue posible cargar el conocimiento.' }, { status: 500 })
  }
}
