import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://domusjulia.cl'),
  title: 'Constructora Atria | Arquitectura, remodelación y diseño de interiores en Concepción',
  description: 'Constructora Atria diseña, construye y remodela espacios en Concepción y la Región del Biobío. Arquitectura, diseño de interiores, paisajismo, cámaras de seguridad y proyectos personalizados.',
  keywords: [
    'constructora en Concepción',
    'arquitectura en Concepción',
    'diseño de interiores en Concepción',
    'diseño de espacios Concepción',
    'remodelaciones en Concepción',
    'empresa de remodelaciones Concepción',
    'paisajismo en Concepción',
    'cámaras de seguridad Concepción',
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
  authors: [{ name: 'Constructora Atria' }],
  creator: 'Constructora Atria',
  publisher: 'Constructora Atria',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Constructora Atria | Arquitectura, remodelación y diseño de interiores en Concepción',
    description: 'Arquitectura, remodelación, diseño de interiores, paisajismo y cámaras de seguridad en Concepción y la Región del Biobío. Conoce Constructora Atria.',
    url: 'https://domusjulia.cl',
    siteName: 'Constructora Atria',
    locale: 'es_CL',
    type: 'website',
  },
  robots: { index: true, follow: true },
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 1, themeColor: '#f4f2ed' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body>{children}</body></html> }
