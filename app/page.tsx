'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownRight, ArrowLeft, ArrowRight, Check, Copy, Loader2, Menu, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const whatsapp = 'https://wa.me/56944544938'
const instagram = 'https://www.instagram.com/cdoma.cl?stkn=MTU1dmNxYmlhNXB0Ng%3D%3D&utm_source=qr'
const conversationStorageKey = 'doma-conversation-id'
const slides = [
  { quote: 'Espacios que hablan de ti.', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=85' },
  { quote: 'Diseño con intención.', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=85' },
  { quote: 'Paisajes para habitar.', image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=2200&q=85' },
  { quote: 'Tu espacio. Nuestra mirada.', image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=2200&q=85' },
]
const projectImages = [
  { title: 'Casa Niebla', location: 'Lo Barnechea, Santiago', category: 'Interiorismo residencial', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85', className: 'md:col-span-7 md:row-span-2' },
  { title: 'Oficinas Norte', location: 'Vitacura, Santiago', category: 'Diseño de ambientes', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85', className: 'md:col-span-5' },
  { title: 'Casa H', location: 'Chicureo, Santiago', category: 'Decoración', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85', className: 'md:col-span-5' },
  { title: 'Jardín Central', location: 'Concepción, Biobío', category: 'Jardinería y paisajismo', image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1200&q=85', className: 'md:col-span-7' },
]

function Header({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 30); window.addEventListener('scroll', onScroll); return () => window.removeEventListener('scroll', onScroll) }, [])
  const links = [['Inicio', 'inicio'], ['Espacios', 'espacios'], ['Remodelaciones', 'remodelaciones'], ['Paisajismo', 'paisajismo'], ['Propiedades', 'propiedades'], ['Contacto', 'contacto']]
  return <header className={`fixed inset-x-0 top-0 z-30 transition-colors duration-500 ${scrolled ? 'bg-[rgba(244,242,237,.96)] text-[#1e1e1b] shadow-[0_1px_0_rgba(30,30,27,.08)]' : 'text-white'}`}>
    <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-6 md:px-10">
      <a href="#inicio" aria-label="Constructora DOMA, inicio" className="group flex items-center gap-3"><span className="relative size-10 overflow-hidden rounded-full border border-[#c9a879]/70 shadow-[0_0_24px_rgba(201,168,121,.2)]"><Image src="/images/doma-logo.jpeg" alt="Logo DOMA" fill sizes="40px" className="object-cover" /></span><span className="font-display text-[21px] font-semibold tracking-[.28em]">DOMA</span></a>
      <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-[.2em] md:flex">{links.map(([label, id]) => <a key={id} href={`#${id}`} className="transition-opacity hover:opacity-50">{label}</a>)}</nav>
      <button aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setOpen(!open)} className="flex size-11 items-center justify-center md:hidden">{open ? <X size={20} /> : <Menu size={20} />}</button>
    </div>
    <AnimatePresence>{open && <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden bg-[#f4f2ed] text-[#1e1e1b] md:hidden"><div className="flex flex-col gap-5 px-6 pb-7 pt-2 text-sm uppercase tracking-[.18em]">{links.map(([label, id]) => <a onClick={() => setOpen(false)} key={id} href={`#${id}`}>{label}</a>)}</div></motion.nav>}</AnimatePresence>
  </header>
}

function Hero() {
  const [active, setActive] = useState(0)
  useEffect(() => { const timer = setInterval(() => setActive((current) => (current + 1) % slides.length), 6500); return () => clearInterval(timer) }, [])
  const move = (direction: number) => setActive((active + direction + slides.length) % slides.length)
  return <section id="inicio" className="relative flex min-h-[760px] h-screen items-end overflow-hidden bg-[#252521] text-white">
    <AnimatePresence mode="wait"> <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }} className="absolute inset-0"><Image src={slides[active].image} alt="Interior contemporáneo CONSTRUCTORA DOMA" fill priority={active === 0} sizes="100vw" className="hero-image object-cover" /></motion.div></AnimatePresence>
    <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(4,7,7,.62),rgba(4,7,7,.18)_48%,rgba(4,7,7,.45))]" />
    <div className="hero-grid pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(201,168,121,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(201,168,121,.1)_1px,transparent_1px)] bg-[size:44px_44px] opacity-50" />
    <div className="doma-noise pointer-events-none absolute inset-0 opacity-20" />
    <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden opacity-[.13]"><p className="whitespace-nowrap text-center font-display text-[29vw] font-semibold leading-none tracking-[-.1em] text-[#c9a879]">DOMA</p></div>
    <div className="doma-orbit pointer-events-none absolute -right-28 top-28 size-[28rem] opacity-70 md:-right-20 md:top-20 md:size-[38rem]" />
    <div className="doma-frame pointer-events-none absolute right-6 top-28 hidden size-24 overflow-hidden md:block"><Image src="/images/doma-logo.jpeg" alt="" fill sizes="96px" className="object-cover opacity-80" /></div>
    <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 md:flex">{slides.map((slide, index) => <button key={slide.quote} aria-label={`Ir a diapositiva ${index + 1}`} onClick={() => setActive(index)} className="group flex items-center gap-3"><span className={`h-px transition-all duration-500 ${active === index ? 'w-10 bg-white' : 'w-4 bg-white/45 group-hover:w-7'}`} /><span className="text-[9px] tracking-[.15em] text-white/70">0{index + 1}</span></button>)}</div>
    <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-10 md:px-10 md:pb-14">
      <div className="flex min-h-[460px] flex-col justify-end md:min-h-[560px]"><div className="mb-8 flex items-center gap-3 text-[10px] uppercase tracking-[.28em] text-white/65"><span className="size-1.5 rounded-full bg-[#c9a879]" /> Construcción · Remodelaciones · Diseño · Paisajismo · Cámaras</div><h1 className="max-w-3xl font-display text-[clamp(2.8rem,7vw,6.8rem)] font-medium leading-[.95] tracking-[-.055em]">{slides[active].quote}</h1></div>
      <div className="mt-14 flex items-end justify-between border-t border-white/30 pt-5"><a href={whatsapp} target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-xs uppercase tracking-[.2em]">Conversemos <ArrowDownRight className="transition-transform group-hover:translate-x-1 group-hover:translate-y-1" size={16} /></a><div className="flex items-center gap-5"><span className="text-[11px] tracking-[.2em]">0{active + 1} <span className="text-white/40">/ 04</span></span><div className="flex gap-2"><button aria-label="Anterior" onClick={() => move(-1)} className="flex size-10 items-center justify-center rounded-full border border-white/30 transition-colors hover:bg-white hover:text-[#1e1e1b]"><ArrowLeft size={15} /></button><button aria-label="Siguiente" onClick={() => move(1)} className="flex size-10 items-center justify-center rounded-full border border-white/30 transition-colors hover:bg-white hover:text-[#1e1e1b]"><ArrowRight size={15} /></button></div></div></div>
    </div>
  </section>
}

function SectionIntro({ number, eyebrow, title, children }: { number: string; eyebrow: string; title: string; children: React.ReactNode }) { return <div className="grid gap-8 md:grid-cols-12 md:gap-10"><div className="md:col-span-3"><p className="text-[11px] uppercase tracking-[.22em] text-[#8a8880]">{number} — {eyebrow}</p></div><div className="md:col-span-8 md:col-start-5"><h2 className="font-display text-[clamp(2.1rem,5vw,4.8rem)] leading-[.98] tracking-[-.05em]">{title}</h2><div className="mt-7 max-w-xl text-base leading-7 text-[#68665f]">{children}</div></div></div> }
function ServiceList({ items }: { items: string[] }) { return <ul className="mt-10 border-t border-[#d4d0c8]">{items.map((item, i) => <li key={item} className="flex items-center justify-between border-b border-[#d4d0c8] py-4 text-sm"><span>0{i + 1}</span><span className="text-right">{item}</span></li>)}</ul> }

function ValuePromise() {
  const promises = [
    ['01', 'Presupuesto claro', 'Decisiones transparentes desde el primer día, sin costos sorpresa.'],
    ['02', 'Ejecución precisa', 'Un equipo que coordina diseño, obra y detalles bajo una misma mirada.'],
    ['03', 'Resultado que perdura', 'Materiales, terminaciones y soluciones pensadas para disfrutarse por años.'],
  ]
  return <section className="value-promise bg-[#1e1e1b] px-6 py-20 text-[#f4f2ed] md:px-10 md:py-28"><div className="mx-auto max-w-[1440px]"><div className="grid gap-10 md:grid-cols-12 md:items-end"><div className="md:col-span-7"><p className="mb-5 text-[11px] uppercase tracking-[.24em] text-[#c9a879]">La diferencia DOMA</p><h2 className="max-w-3xl font-display text-[clamp(2.6rem,6vw,6rem)] leading-[.92] tracking-[-.06em]">Premium no es pagar de más. Es <span className="doma-metal">decidir mejor.</span></h2></div><p className="max-w-sm text-base leading-7 text-white/60 md:col-span-4 md:col-start-9">Diseñamos y ejecutamos con el mismo cuidado que invertiríamos en nuestro propio espacio: belleza, orden y una relación honesta entre calidad y presupuesto.</p></div><div className="mt-16 grid gap-8 border-t border-white/15 pt-7 md:grid-cols-3 md:gap-6">{promises.map(([number, title, text]) => <div key={number} className="value-card border-b border-white/15 pb-7 md:border-b-0 md:border-r md:pb-0 md:pr-8 last:border-0"><p className="text-[11px] tracking-[.2em] text-[#c9a879]">{number}</p><h3 className="mt-8 font-display text-2xl tracking-[-.03em]">{title}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-white/55">{text}</p></div>)}</div><a href={whatsapp} target="_blank" rel="noreferrer" className="mt-12 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#c9a879] px-6 text-xs uppercase tracking-[.18em] text-[#1e1e1b] transition-transform hover:-translate-y-1">Evaluar mi proyecto <ArrowDownRight size={16} /></a></div></section>
}

function ContentStudio() {
  const [format, setFormat] = useState<'publicación' | 'historia' | 'reel'>('publicación')
  const [topic, setTopic] = useState('Una remodelación que mejora la forma de vivir')
  const [audience, setAudience] = useState('Personas que quieren transformar su casa')
  const [tone, setTone] = useState('Premium, cercano y claro')
  const [result, setResult] = useState<{ title: string; hook: string; caption: string; visualDirection: string; cta: string; hashtags: string[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function generate(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setCopied(false)
    try {
      const response = await fetch('/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ format, topic, audience, tone }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setResult(data)
    } catch { setResult(null) } finally { setLoading(false) }
  }

  const copyContent = async () => {
    if (!result) return
    await navigator.clipboard.writeText(`${result.hook}\n\n${result.caption}\n\n${result.cta}\n\n${result.hashtags.join(' ')}`)
    setCopied(true)
  }

  return <section id="contenido" className="bg-[#ebe7df] px-6 py-24 md:px-10 md:py-32"><div className="mx-auto max-w-[1440px]"><div className="grid gap-12 md:grid-cols-12 md:items-start"><div className="md:col-span-5"><p className="mb-5 flex items-center gap-2 text-[11px] uppercase tracking-[.24em] text-[#8d6f45]"><Sparkles size={14} /> DOMA / ESTUDIO CREATIVO</p><h2 className="font-display text-[clamp(2.5rem,6vw,5.8rem)] leading-[.92] tracking-[-.06em]">Contenido con la misma intención que nuestros espacios.</h2><p className="mt-7 max-w-md text-base leading-7 text-[#68665f]">Define una idea y recibe una pieza lista para publicar, con dirección visual y una voz que se siente DOMA.</p></div><form onSubmit={generate} className="rounded-2xl bg-[#1e1e1b] p-5 text-[#f4f2ed] shadow-[0_24px_60px_rgba(30,30,27,.16)] md:col-span-7 md:p-8"><div className="grid gap-5"><div><label className="mb-2 block text-[10px] uppercase tracking-[.18em] text-[#c9a879]">Formato</label><div className="grid grid-cols-3 gap-2">{(['publicación', 'historia', 'reel'] as const).map((item) => <button type="button" key={item} onClick={() => setFormat(item)} className={`min-h-11 rounded-lg border px-2 text-xs capitalize transition-colors ${format === item ? 'border-[#c9a879] bg-[#c9a879] text-[#1e1e1b]' : 'border-white/15 text-white/65 hover:border-[#c9a879]'}`}>{item}</button>)}</div></div><div><label htmlFor="content-topic" className="mb-2 block text-[10px] uppercase tracking-[.18em] text-[#c9a879]">Idea central</label><input id="content-topic" value={topic} onChange={(event) => setTopic(event.target.value)} maxLength={300} className="min-h-12 w-full rounded-lg border border-white/15 bg-white/5 px-4 text-base outline-none focus:border-[#c9a879]" /></div><div className="grid gap-5 md:grid-cols-2"><div><label htmlFor="content-audience" className="mb-2 block text-[10px] uppercase tracking-[.18em] text-[#c9a879]">Audiencia</label><input id="content-audience" value={audience} onChange={(event) => setAudience(event.target.value)} maxLength={160} className="min-h-12 w-full rounded-lg border border-white/15 bg-white/5 px-4 text-base outline-none focus:border-[#c9a879]" /></div><div><label htmlFor="content-tone" className="mb-2 block text-[10px] uppercase tracking-[.18em] text-[#c9a879]">Tono</label><input id="content-tone" value={tone} onChange={(event) => setTone(event.target.value)} maxLength={120} className="min-h-12 w-full rounded-lg border border-white/15 bg-white/5 px-4 text-base outline-none focus:border-[#c9a879]" /></div></div><button disabled={loading || !topic.trim()} className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#c9a879] px-5 text-xs uppercase tracking-[.18em] text-[#1e1e1b] transition-transform hover:-translate-y-0.5 disabled:opacity-50">{loading ? <><Loader2 className="animate-spin" size={16} /> Creando</> : <><Sparkles size={16} /> Crear contenido</>}</button></div>{result && <div className="mt-8 border-t border-white/15 pt-7"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.18em] text-[#c9a879]">{result.title}</p><h3 className="mt-3 font-display text-2xl leading-tight">{result.hook}</h3></div><button type="button" onClick={copyContent} aria-label="Copiar contenido" className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15">{copied ? <Check size={16} /> : <Copy size={16} />}</button></div><p className="mt-5 whitespace-pre-line text-sm leading-6 text-white/75">{result.caption}</p><p className="mt-5 text-sm leading-6 text-[#c9a879]">{result.visualDirection}</p><p className="mt-5 text-xs uppercase tracking-[.14em] text-white/55">{result.cta}</p><p className="mt-4 text-xs text-white/45">{result.hashtags.join(' ')}</p></div>}</form></div></div></section>
}

function DomaChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Hola. Soy DOMA. Cuéntame qué tipo de proyecto tienes en mente y te ayudaré a definirlo.' },
  ])
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!input.trim() || loading) return
    const next = [...messages, { role: 'user' as const, content: input.trim() }]
    const savedConversationId = sessionStorage.getItem(conversationStorageKey)
    const activeConversationId = conversationId
      ?? (savedConversationId && /^[a-zA-Z0-9_-]{8,100}$/.test(savedConversationId)
        ? savedConversationId
        : crypto.randomUUID())
    setConversationId(activeConversationId)
    sessionStorage.setItem(conversationStorageKey, activeConversationId)
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, conversationId: activeConversationId }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Chat request failed')
      if (typeof data.conversationId === 'string') {
        setConversationId(data.conversationId)
        sessionStorage.setItem(conversationStorageKey, data.conversationId)
      }
      setMessages((current) => [...current, { role: 'assistant', content: data.text ?? 'Escríbenos por WhatsApp y te ayudaremos directamente.' }])
    } catch {
      setMessages((current) => [...current, { role: 'assistant', content: 'No pudimos conectar ahora. Puedes escribirnos por WhatsApp al +56 9 4454 4938.' }])
    } finally {
      setLoading(false)
    }
  }

  return <div className="fixed bottom-5 right-5 z-40 md:bottom-7 md:right-7">
    {open && <motion.section initial={{ opacity: 0, y: 18, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="mb-3 flex w-[calc(100vw-2.5rem)] max-w-[360px] flex-col overflow-hidden rounded-2xl border border-[#c9a879]/35 bg-[#171411] text-[#f3eee7] shadow-[0_24px_80px_rgba(0,0,0,.35)]" aria-label="Chat de DOMA">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><div><p className="font-display text-lg">DOMA / IA</p><p className="mt-1 text-[10px] uppercase tracking-[.16em] text-[#c9a879]">Asistente de proyectos</p></div><button onClick={() => setOpen(false)} aria-label="Cerrar chat" className="flex size-10 items-center justify-center rounded-full border border-white/15"><X size={16} /></button></div>
      <div className="flex max-h-[300px] flex-col gap-3 overflow-y-auto px-4 py-4">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`max-w-[88%] rounded-xl px-3 py-2.5 text-sm leading-5 ${message.role === 'user' ? 'self-end bg-[#c9a879] text-[#171411]' : 'bg-white/10 text-[#f3eee7]'}`}>{message.content}</div>)}{loading && <div className="flex items-center gap-2 text-xs text-[#c9a879]"><Loader2 className="animate-spin" size={14} /> Pensando</div>}</div>
      <form onSubmit={submit} className="flex gap-2 border-t border-white/10 p-3"><label htmlFor="doma-chat-input" className="sr-only">Escribe tu pregunta</label><input id="doma-chat-input" value={input} onChange={(event) => setInput(event.target.value)} maxLength={4000} placeholder="Escribe tu pregunta..." className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-base text-white outline-none placeholder:text-white/45 focus:border-[#c9a879]" /><button type="submit" aria-label="Enviar pregunta" disabled={loading || !input.trim()} className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#c9a879] text-[#171411] disabled:opacity-40"><Send size={16} /></button></form>
    </motion.section>}
    <button onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Cerrar asistente DOMA' : 'Abrir asistente DOMA'} className="ml-auto flex size-14 items-center justify-center rounded-full border border-[#c9a879]/60 bg-[#171411] text-[#c9a879] shadow-[0_12px_35px_rgba(0,0,0,.28)] transition-transform hover:scale-105"><MessageCircle size={22} /></button>
  </div>
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: 'Constructora DOMA',
    description: 'Constructora DOMA en Concepción y San Pedro de la Paz: construcción, remodelaciones, terminaciones, diseño, jardinería, paisajismo e instalación de cámaras.',
    url: 'https://constructoradoma.cl',
    telephone: '+56944544938',
areaServed: [
    { '@type': 'City', name: 'Concepción' },
    { '@type': 'City', name: 'San Pedro de la Paz' },
    { '@type': 'AdministrativeArea', name: 'Región del Biobío' },
  ],
  address: { '@type': 'PostalAddress', addressLocality: 'Concepción', addressRegion: 'Biobío', addressCountry: 'CL' },
    sameAs: [instagram, 'https://wa.me/56944544938'],
  }
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><Header open={menuOpen} setOpen={setMenuOpen} /><Hero /><ValuePromise /><ContentStudio /><DomaChat />
    <section id="propiedades" className="bg-[#ebe7df] px-6 py-24 md:px-10 md:py-36"><div className="mx-auto max-w-[1440px]"><SectionIntro number="01" eyebrow="Propiedades" title="Encuentra un lugar para tu próxima historia.">Como corredora de propiedades en Concepción, acompañamos cada compra, venta y arriendo con criterio, transparencia y una mirada atenta a lo que hace especial a cada espacio.</SectionIntro><div className="mt-16 grid gap-5 md:grid-cols-3"><div className="border-t border-[#c8c2b8] pt-5"><p className="font-display text-2xl">Compra y venta</p><p className="mt-3 text-sm leading-6 text-[#68665f]">Valoramos tu propiedad y construimos una estrategia para presentarla de forma precisa.</p></div><div className="border-t border-[#c8c2b8] pt-5"><p className="font-display text-2xl">Arriendos</p><p className="mt-3 text-sm leading-6 text-[#68665f]">Conectamos personas con casas, departamentos y espacios que responden a su forma de vivir.</p></div><div className="border-t border-[#c8c2b8] pt-5"><p className="font-display text-2xl">Concepción y Biobío</p><p className="mt-3 text-sm leading-6 text-[#68665f]">Conocimiento local para acompañarte en Concepción y las comunas de la Región del Biobío.</p></div></div><a href={whatsapp} target="_blank" rel="noreferrer" className="mt-12 inline-flex min-h-12 items-center gap-3 border-b border-[#1e1e1b] pb-3 text-xs uppercase tracking-[.2em]">Consultar propiedades <ArrowDownRight size={16} /></a></div></section>
    <section id="espacios" className="px-6 py-24 md:px-10 md:py-40"><div className="mx-auto max-w-[1440px]"><SectionIntro number="01" eyebrow="Espacios" title="Diseñamos espacios con carácter.">En Constructora DOMA desarrollamos y transformamos espacios mediante construcción, remodelaciones, terminaciones, diseño e interiorismo. Nos ocupamos de cada proyecto de manera integral, desde la planificación hasta la ejecución y los detalles finales.</SectionIntro><div className="mt-20 grid gap-6 md:grid-cols-12"><div className="md:col-span-7"><div className="relative aspect-[4/3] overflow-hidden"><Image src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85" alt="Living contemporáneo diseñado por CONSTRUCTORA DOMA" fill sizes="(max-width: 768px) 100vw, 58vw" className="object-cover transition-transform duration-700 hover:scale-105" /></div></div><div className="flex flex-col justify-end md:col-span-4 md:col-start-9"><p className="text-sm leading-6 text-[#68665f]">Una mirada sensible sobre la materia, la luz y las proporciones.</p><ServiceList items={['Interiorismo', 'Decoración', 'Diseño de ambientes', 'Asesoría estética', 'Proyectos personalizados']} /></div></div></div></section>
    <section id="remodelaciones" className="bg-[#ebe7df] px-6 py-24 md:px-10 md:py-40"><div className="mx-auto max-w-[1440px]"><SectionIntro number="02" eyebrow="Remodelaciones" title="Transformamos la forma de habitar.">Planificamos remodelaciones integrales y parciales para casas, departamentos, oficinas y comercios en Concepción. Desde la distribución hasta los detalles finales, cuidamos cada decisión.</SectionIntro><div className="mt-16 grid gap-5 md:grid-cols-3"><div className="border-t border-[#c8c2b8] pt-5"><p className="font-display text-2xl">Remodelación integral</p><p className="mt-3 text-sm leading-6 text-[#68665f]">Una visión completa para renovar la identidad, funcionalidad y materialidad de tu espacio.</p></div><div className="border-t border-[#c8c2b8] pt-5"><p className="font-display text-2xl">Cocinas y baños</p><p className="mt-3 text-sm leading-6 text-[#68665f]">Diseño de ambientes esenciales con soluciones duraderas, sobrias y a tu medida.</p></div><div className="border-t border-[#c8c2b8] pt-5"><p className="font-display text-2xl">Dirección de proyecto</p><p className="mt-3 text-sm leading-6 text-[#68665f]">Acompañamiento cercano para ordenar decisiones, etapas y ejecución.</p></div></div><a href={whatsapp} target="_blank" rel="noreferrer" className="mt-12 inline-flex min-h-12 items-center gap-3 border-b border-[#1e1e1b] pb-3 text-xs uppercase tracking-[.2em]">Cotizar remodelación <ArrowDownRight size={16} /></a></div></section>
    <section id="paisajismo" className="bg-[#ded9cf] px-6 py-24 md:px-10 md:py-40"><div className="mx-auto max-w-[1440px]"><SectionIntro number="03" eyebrow="Jardinería y paisajismo" title="Diseñamos exteriores para vivirlos.">Creamos jardines y áreas verdes que dialogan con la arquitectura, el entorno y la forma de habitar cada espacio.</SectionIntro><div className="mt-20 grid gap-6 md:grid-cols-12"><div className="order-2 flex flex-col justify-end md:order-1 md:col-span-4"><p className="text-sm leading-6 text-[#68665f]">Proyectos exteriores pensados con criterio estético, funcional y natural.</p><ServiceList items={['Jardinería', 'Paisajismo', 'Diseño de áreas verdes', 'Selección de especies', 'Proyectos exteriores personalizados']} /></div><div className="order-1 md:order-2 md:col-span-7 md:col-start-6"><div className="relative aspect-[4/3] overflow-hidden"><Image src="https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1400&q=85" alt="Proyecto de jardinería y paisajismo de Constructora DOMA" fill sizes="(max-width: 768px) 100vw, 58vw" className="object-cover transition-transform duration-700 hover:scale-105" /></div></div></div></div></section>
    <section id="camaras" className="bg-[#e7e2d9] px-6 py-24 md:px-10 md:py-40"><div className="mx-auto max-w-[1440px]"><SectionIntro number="04" eyebrow="Instalación de cámaras" title="Cámaras instaladas con precisión.">Instalamos sistemas de cámaras para hogares, oficinas y comercios, cuidando la ubicación, la configuración y la integración visual de cada equipo.</SectionIntro><div className="mt-16 grid gap-5 md:grid-cols-3"><div className="border-t border-[#c8c2b8] pt-5"><p className="font-display text-2xl">Instalación</p><p className="mt-3 text-sm leading-6 text-[#68665f]">Montaje limpio y ubicación estratégica de cámaras interiores y exteriores.</p></div><div className="border-t border-[#c8c2b8] pt-5"><p className="font-display text-2xl">Configuración</p><p className="mt-3 text-sm leading-6 text-[#68665f]">Puesta en marcha y configuración precisa de los equipos instalados.</p></div><div className="border-t border-[#c8c2b8] pt-5"><p className="font-display text-2xl">Solución personalizada</p><p className="mt-3 text-sm leading-6 text-[#68665f]">Una propuesta ajustada a las características de cada espacio.</p></div></div></div></section>
    <section id="proyectos" className="px-6 py-24 md:px-10 md:py-40"><div className="mx-auto max-w-[1440px]"><div className="mb-16 flex items-end justify-between"><div><p className="mb-5 text-[11px] uppercase tracking-[.22em] text-[#8a8880]">03 — Proyectos</p><h2 className="font-display text-[clamp(2.4rem,6vw,5.4rem)] leading-none tracking-[-.055em]">Arquitectura<br />que se vive.</h2></div><p className="hidden max-w-[220px] text-sm leading-6 text-[#68665f] md:block">Cada espacio es una oportunidad para hacer visible lo esencial.</p></div><div className="grid gap-6 md:grid-cols-12 md:auto-rows-[220px]">{projectImages.map((project) => <article key={project.title} className={`group ${project.className}`}><div className="relative h-full min-h-[300px] overflow-hidden"><Image src={project.image} alt={`${project.title}, ${project.category}`} fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-5 pt-16 text-white"><p className="font-display text-lg">{project.title}</p><p className="mt-1 text-[10px] uppercase tracking-[.15em] text-white/70">{project.location} · {project.category}</p></div></div></article>)}</div></div></section>
    <section id="contacto" className="bg-[#1e1e1b] px-6 py-28 text-[#f4f2ed] md:px-10 md:py-44"><div className="mx-auto max-w-[1440px]"><p className="mb-10 text-[11px] uppercase tracking-[.22em] text-[#a7a49b]">05 — Contacto</p><div className="flex flex-col justify-between gap-14 md:flex-row md:items-end"><h2 className="max-w-4xl font-display text-[clamp(2.8rem,7vw,7rem)] leading-[.9] tracking-[-.065em]">Hablemos de tu<br />próximo espacio.</h2><div className="max-w-xs"><p className="mb-8 text-base leading-7 text-[#a7a49b]">Cuéntanos qué estás buscando. Conversemos sobre tu próximo proyecto de construcción, remodelación, diseño, jardinería, paisajismo o instalación de cámaras en Concepción y San Pedro de la Paz.</p><a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-4 border-b border-[#f4f2ed] pb-3 text-xs uppercase tracking-[.2em] transition-opacity hover:opacity-60">Hablar por WhatsApp <ArrowDownRight size={16} /></a></div></div><div className="mt-28 flex flex-col justify-between gap-8 border-t border-white/20 pt-6 text-[10px] uppercase tracking-[.2em] text-[#a7a49b] md:flex-row"><span>CONSTRUCTORA DOMA</span><span>+56 9 4454 4938</span><span>Concepción · Construcción · Diseño · Paisajismo</span><a href={instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-[#c9a879]">Instagram</a></div></div></section>
  </main>
}
