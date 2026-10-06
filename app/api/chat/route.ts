import { NextResponse } from 'next/server'
import { createChatCompletion } from '../../../lib/openai'
import { formatKnowledgeContext, retrieveKnowledge } from '../../../lib/rag'
import { createConversationId, ensureConversation, insertConversationMessage, safeError, safeLog } from '../../../lib/supabase'

export const runtime = 'nodejs'

const MAX_MESSAGE_LENGTH = 4000
const system = `Eres DOMA IA, el asistente de proyectos de Constructora DOMA en Concepción, San Pedro de la Paz y la Región del Biobío.

DOMA trabaja en construcción, terminaciones, diseño, interiorismo, paisajismo, seguridad perimetral, cámaras, automatización y domótica. Tu tono es sofisticado, profesional, cercano y preciso. Ayuda a transformar una consulta inicial en un proyecto concreto.

REGLAS:
- Usa prioritariamente el CONTEXTO DE DOMA que aparece abajo.
- Diferencia claramente entre información respaldada por DOMA y lo que no conoces.
- No inventes precios, disponibilidad, plazos, productos, características técnicas, proyectos ni servicios.
- Si la respuesta no está en el contexto, dilo: "No encuentro esa información en la base de conocimiento de DOMA." Luego ofrece continuar por WhatsApp al +56 9 4454 4938.
- Nunca ejecutes SQL ni prometas acciones que no estén implementadas.
- Responde en español y de forma breve, útil y natural.

CONTEXTO DE DOMA:
`

export async function POST(request: Request) {
  try {
    const body = await request.json() as { message?: unknown; conversationId?: unknown; messages?: unknown }
    const incoming = typeof body.message === 'string'
      ? body.message
      : Array.isArray(body.messages)
        ? String(body.messages.at(-1)?.content ?? '')
        : ''
    const message = incoming.trim()
    if (!message || message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: 'El mensaje es obligatorio y debe tener hasta 4000 caracteres.' }, { status: 400 })
    }

    const conversationId = createConversationId(body.conversationId)
    const matches = await retrieveKnowledge(message)
    const answer = await createChatCompletion([
      { role: 'system', content: `${system}${formatKnowledgeContext(matches)}` },
      { role: 'user', content: message },
    ])
    if (!answer) throw new Error('Empty OpenAI response')

    await ensureConversation(conversationId)
    await Promise.all([
      insertConversationMessage({ conversationId, role: 'user', content: message }),
      insertConversationMessage({ conversationId, role: 'assistant', content: answer }),
    ])
    safeLog('chat_completed', { conversationId, matches: matches.length })
    return NextResponse.json({ text: answer, conversationId, sources: matches.map(({ metadata, similarity }) => ({ metadata, similarity })) })
  } catch (error) {
    safeError(error instanceof Error ? error.message : 'chat_failed')
    return NextResponse.json({ error: 'No pudimos consultar DOMA IA en este momento.' }, { status: 500 })
  }
}
