import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://domusjulia.cl'),
  title: 'Domus Julia | Corredora de propiedades en Concepción',
  description: 'Domus Julia es una corredora de propiedades en Concepción, Chile. Compra, venta y arriendo de propiedades con una mirada experta en espacios, diseño y seguridad.',
  keywords: [
    'corredora de propiedades en Concepción',
    'corredora de propiedades Concepción Chile',
    'venta de propiedades en Concepción',
    'arriendo de propiedades en Concepción',
    'casas en venta Concepción',
    'departamentos en arriendo Concepción',
    'gestión inmobiliaria Concepción',
    'interiorismo Concepción',
    'decoración de interiores Concepción',
  ],
  authors: [{ name: 'Domus Julia' }],
  creator: 'Domus Julia',
  publisher: 'Domus Julia',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Domus Julia | Corredora de propiedades en Concepción',
    description: 'Propiedades, espacios y proyectos con una mirada experta en Concepción y la Región del Biobío.',
    url: 'https://domusjulia.cl',
    siteName: 'Domus Julia',
    locale: 'es_CL',
    type: 'website',
  },
  robots: { index: true, follow: true },
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 1, themeColor: '#f4f2ed' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body>{children}</body></html> }
