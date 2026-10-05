import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://domusjulia.cl'),
  title: 'Domus Julia | Diseño de interiores y remodelaciones en Concepción',
  description: 'Domus Julia diseña y remodela espacios en Concepción y la Región del Biobío. Interiorismo, decoración, proyectos personalizados y corretaje de propiedades.',
  keywords: [
    'diseño de interiores en Concepción',
    'diseño de espacios Concepción',
    'remodelaciones en Concepción',
    'remodelación de casas en Concepción',
    'interiorismo en Concepción Chile',
    'decoración de interiores Concepción',
    'diseño de ambientes Concepción',
    'arquitectura interior Concepción',
    'proyectos de remodelación Biobío',
    'corredora de propiedades en Concepción',
    'venta de propiedades en Concepción',
    'arriendo de propiedades en Concepción',
  ],
  authors: [{ name: 'Domus Julia' }],
  creator: 'Domus Julia',
  publisher: 'Domus Julia',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Domus Julia | Diseño de interiores y remodelaciones en Concepción',
    description: 'Diseño de interiores, remodelaciones y propiedades en Concepción y la Región del Biobío. Conoce Domus Julia.',
    url: 'https://domusjulia.cl',
    siteName: 'Domus Julia',
    locale: 'es_CL',
    type: 'website',
  },
  robots: { index: true, follow: true },
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 1, themeColor: '#f4f2ed' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body>{children}</body></html> }
