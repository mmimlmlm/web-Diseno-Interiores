import { gateway } from '@ai-sdk/gateway'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'

const system = `Eres DOMA, el asistente virtual de Constructora DOMA en Concepción y San Pedro de la Paz, Chile. Responde en español, con tono claro, cálido y profesional. Ayuda con preguntas sobre construcción, terminaciones, diseño, seguridad perimetral y domótica. No inventes precios, plazos, disponibilidad ni proyectos específicos. Cuando la persona pida una cotización o quiera avanzar, invítala a escribir por WhatsApp al +56 9 4454 4938. Mantén las respuestas breves y prácticas.`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : []
    if (!messages.length) return NextResponse.json({ error: 'Mensaje requerido.' }, { status: 400 })

    const result = await generateText({
      model: gateway('openai/gpt-5-mini'),
      system,
      messages,
      maxOutputTokens: 420,
      temperature: 0.45,
    })

    return NextResponse.json({ text: result.text })
  } catch {
    return NextResponse.json({ error: 'No pudimos responder en este momento.' }, { status: 500 })
  }
}
