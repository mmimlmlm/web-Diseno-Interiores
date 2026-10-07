import { NextResponse } from 'next/server'
import { createProjectChatCompletion } from '../../../lib/openai'
import { formatKnowledgeContext, retrieveKnowledge } from '../../../lib/rag'
import {
  createConversationId,
  ensureConversation,
  getConversationMessages,
  getProjectLead,
  insertConversationMessage,
  safeError,
  safeLog,
  upsertProjectLead,
} from '../../../lib/supabase'

export const runtime = 'nodejs'

const MAX_MESSAGE_LENGTH = 4000
const system = `Eres DOMA IA, el asistente de proyectos de Constructora DOMA en Concepción, San Pedro de la Paz y la Región del Biobío.

La oferta vigente de DOMA se limita a construcción, remodelaciones, terminaciones, diseño, interiorismo, jardinería, paisajismo e instalación de cámaras. Tu tono es sofisticado, profesional, cercano y preciso. Ayuda a transformar una consulta inicial en un proyecto concreto.

REGLAS:
- Usa prioritariamente el CONTEXTO DE DOMA que aparece abajo.
- Diferencia claramente entre información respaldada por DOMA y lo que no conoces.
- No inventes precios, disponibilidad, plazos, productos, características técnicas, proyectos ni servicios.
- Si falta información técnica o comercial en el contexto, dilo con claridad, pero continúa calificando el proyecto antes de derivar a WhatsApp.
- Nunca ejecutes SQL ni prometas acciones que no estén implementadas.
- Responde en español y de forma breve, útil y natural.
- Tu objetivo comercial es llevar de forma natural a toda persona interesada en un proyecto a compartir: tipo de proyecto, presupuesto estimado, nombre y número de celular.
- Primero entiende la necesidad. Luego pide un solo dato faltante por respuesta, normalmente en este orden: tipo de proyecto, presupuesto, nombre y celular.
- No repitas preguntas sobre datos que el usuario ya entregó y no conviertas la conversación en un formulario.
- Los DATOS YA CAPTURADOS provienen de mensajes anteriores del usuario: recuérdalos, no vuelvas a pedirlos y solo cámbialos si el usuario los corrige explícitamente.
- Antes de pedir el celular, explica brevemente que se usará únicamente para que DOMA lo contacte sobre su proyecto.
- Cuando ya tengas tipo de proyecto, presupuesto, nombre y celular, confirma brevemente que el equipo de DOMA podrá contactarlo. No prometas fecha ni plazo de contacto.
- No inventes ni deduzcas datos del cliente. En el objeto "lead", incluye únicamente datos que el usuario haya escrito explícitamente en la conversación.
- "projectType" debe describir el tipo de proyecto indicado por el usuario, por ejemplo: remodelación de cocina, construcción, interiorismo, paisajismo, jardinería o instalación de cámaras.
- Si no existe una intención real de realizar un proyecto, devuelve todos los campos de "lead" como null.
- Conserva el presupuesto tal como lo expresa el cliente (por ejemplo, "$8.000.000 CLP" o "entre 5 y 7 millones").
- "projectDetails" debe ser un resumen breve de los datos explícitos sobre el proyecto, sin agregar supuestos.

CONTEXTO DE DOMA:
`

type IncomingMessage = { role: 'user' | 'assistant'; content: string }

function normalizeMessages(value: unknown): IncomingMessage[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is IncomingMessage => {
      if (!item || typeof item !== 'object') return false
      const candidate = item as Partial<IncomingMessage>
      return (candidate.role === 'user' || candidate.role === 'assistant') && typeof candidate.content === 'string'
    })
    .map((item) => ({ role: item.role, content: item.content.trim().slice(0, MAX_MESSAGE_LENGTH) }))
    .filter((item) => item.content)
    .slice(-24)
}

function cleanLeadValue(value: string | null, maxLength: number) {
  const cleaned = value?.trim().slice(0, maxLength)
  return cleaned || undefined
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { message?: unknown; conversationId?: unknown; messages?: unknown }
    const history = normalizeMessages(body.messages)
    const directMessage = typeof body.message === 'string' ? body.message.trim() : ''
    if (directMessage) history.push({ role: 'user', content: directMessage.slice(0, MAX_MESSAGE_LENGTH) })
    const message = [...history].reverse().find((item) => item.role === 'user')?.content ?? ''
    if (!message || message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: 'El mensaje es obligatorio y debe tener hasta 4000 caracteres.' }, { status: 400 })
    }

    const conversationId = createConversationId(body.conversationId)
    const [matches, storedHistory, savedLead] = await Promise.all([
      retrieveKnowledge(message),
      getConversationMessages(conversationId).catch((error) => {
        safeError(error instanceof Error ? error.message : 'conversation_history_failed')
        return []
      }),
      getProjectLead(conversationId).catch((error) => {
        safeError(error instanceof Error ? error.message : 'lead_context_failed')
        return null
      }),
    ])
    const modelHistory = storedHistory.length
      ? [...storedHistory, { role: 'user' as const, content: message }]
      : history
    const savedLeadContext = savedLead
      ? JSON.stringify(savedLead)
      : 'No hay datos capturados todavía.'
    const result = await createProjectChatCompletion([
      {
        role: 'system',
        content: `${system}${formatKnowledgeContext(matches)}\n\nDATOS YA CAPTURADOS:\n${savedLeadContext}`,
      },
      ...modelHistory,
    ])
    const answer = result.text.trim()
    if (!answer) throw new Error('Empty OpenAI response')

    let leadSaved = false
    try {
      await ensureConversation(conversationId)
      const lead = {
        name: cleanLeadValue(result.lead.name, 200),
        phone: cleanLeadValue(result.lead.phone, 50),
        budget: cleanLeadValue(result.lead.budget, 200),
        projectType: cleanLeadValue(result.lead.projectType, 200),
        projectDetails: cleanLeadValue(result.lead.projectDetails, 3000),
      }
      await insertConversationMessage({ conversationId, role: 'user', content: message })
      await insertConversationMessage({ conversationId, role: 'assistant', content: answer })
      if (Object.values(lead).some(Boolean)) {
        await upsertProjectLead({ conversationId, ...lead })
        leadSaved = true
      }
    } catch (persistError) {
      leadSaved = false
      safeError(persistError instanceof Error ? persistError.message : 'conversation_persist_failed')
    }
    safeLog('chat_completed', { conversationId, matches: matches.length })
    return NextResponse.json({
      text: answer,
      conversationId,
      leadSaved,
      sources: matches.map(({ metadata, similarity }) => ({ metadata, similarity })),
    })
  } catch (error) {
    safeError(error instanceof Error ? error.message : 'chat_failed')
    return NextResponse.json({ error: 'No pudimos consultar DOMA IA en este momento.' }, { status: 500 })
  }
}
