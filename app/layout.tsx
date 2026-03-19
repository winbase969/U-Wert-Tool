import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://u-wert-tool.vercel.app'),
  title: {
    default: 'U-Wert Rechner für Wand, Dach, Boden, Fenster und Türen',
    template: '%s | U-Wert Rechner',
  },
  description:
    'SEO-optimiertes U-Wert-Berechnungstool mit geführter Eingabe, Beispielwerten für Deutschland und detailliertem Schichtaufbau für Wand, Dach, Decke, Boden, Fenster und Türen.',
  applicationName: 'U-Wert Rechner',
  keywords: [
    'U-Wert Rechner',
    'U-Wert berechnen',
    'Wärmedurchgangskoeffizient',
    'Wand U-Wert',
    'Dach U-Wert',
    'Fenster U-Wert',
    'Boden U-Wert',
    'Bauteil U-Wert',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'U-Wert Rechner – schnell und detailliert',
    description:
      'Interaktives Next.js Tool zur überschlägigen U-Wert-Berechnung mit Beispielbauteilen und geführter Erklärung.',
    url: 'https://u-wert-tool.vercel.app',
    siteName: 'U-Wert Rechner',
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'U-Wert Rechner – schnell und detailliert',
    description:
      'Interaktiver Rechner mit Schnellmodus, Detailmodus, Schichtaufbau und typischen Beispielwerten für Deutschland.',
  },
};

export const viewport: Viewport = {
  themeColor: '#0b6bcb',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
