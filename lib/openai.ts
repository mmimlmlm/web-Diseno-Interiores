const gatewayKey = process.env.AI_GATEWAY_API_KEY
const gatewayUrl = 'https://ai-gateway.vercel.sh/v1'

function getKey() {
  if (!gatewayKey) throw new Error('AI_GATEWAY_API_KEY is not configured')
  return gatewayKey
}

async function gateway<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${gatewayUrl}/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getKey()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`AI Gateway request failed: ${response.status}`)
  return response.json() as Promise<T>
}

export async function createEmbedding(input: string) {
  const result = await gateway<{ data: Array<{ embedding: number[] }> }>('embeddings', {
    model: 'text-embedding-3-small', input,
  })
  return result.data[0].embedding
}

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

export type LeadSnapshot = {
  name: string | null
  phone: string | null
  budget: string | null
  projectType: string | null
  projectDetails: string | null
}

export async function createProjectChatCompletion(messages: ChatMessage[]) {
  const result = await gateway<{ choices: Array<{ message: { content: string } }> }>('chat/completions', {
    model: 'gpt-4o-mini',
    messages,
    temperature: 0.35,
    max_tokens: 700,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'doma_project_chat',
        strict: true,
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            text: { type: 'string' },
            lead: {
              type: 'object',
              additionalProperties: false,
              properties: {
                name: { type: ['string', 'null'] },
                phone: { type: ['string', 'null'] },
                budget: { type: ['string', 'null'] },
                projectType: { type: ['string', 'null'] },
                projectDetails: { type: ['string', 'null'] },
              },
              required: ['name', 'phone', 'budget', 'projectType', 'projectDetails'],
            },
          },
          required: ['text', 'lead'],
        },
      },
    },
  })
  const content = result.choices[0]?.message.content
  if (!content) throw new Error('Empty OpenAI response')
  return JSON.parse(content) as { text: string; lead: LeadSnapshot }
}

export type ContentFormat = 'publicación' | 'historia' | 'reel'

export async function createSocialContent(input: { format: ContentFormat; topic: string; audience: string; tone: string }) {
  const result = await gateway<{ choices: Array<{ message: { content: string } }> }>('chat/completions', {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Eres la directora creativa de DOMA, una marca premium de construcción, remodelación, interiorismo y paisajismo en el Biobío. Crea contenido en español de Chile: sofisticado, concreto, aspiracional y honesto. No inventes proyectos, precios, clientes, resultados ni servicios. Devuelve JSON válido con title, hook, caption, visualDirection, cta y hashtags.' },
      { role: 'user', content: `Crea una pieza para Instagram. Formato: ${input.format}. Tema: ${input.topic}. Audiencia: ${input.audience}. Tono: ${input.tone}. Para ${input.format === 'reel' ? 'un video de 20-30 segundos con escenas sugeridas y texto en pantalla dentro de visualDirection' : input.format === 'historia' ? 'una secuencia de 3 historias, descritas dentro de caption' : 'un carrusel o publicación única'}. El CTA debe invitar a evaluar un proyecto con DOMA.` },
    ],
    temperature: 0.7,
    max_tokens: 900,
    response_format: { type: 'json_schema', json_schema: { name: 'doma_social_content', strict: true, schema: { type: 'object', additionalProperties: false, properties: { title: { type: 'string' }, hook: { type: 'string' }, caption: { type: 'string' }, visualDirection: { type: 'string' }, cta: { type: 'string' }, hashtags: { type: 'array', items: { type: 'string' } } }, required: ['title', 'hook', 'caption', 'visualDirection', 'cta', 'hashtags'] } } },
  })
  const content = result.choices[0]?.message.content
  if (!content) throw new Error('Empty social content response')
  return JSON.parse(content) as { title: string; hook: string; caption: string; visualDirection: string; cta: string; hashtags: string[] }
}

export function openAiIsConfigured() { return Boolean(gatewayKey) }
