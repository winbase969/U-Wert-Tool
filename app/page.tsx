import { UValueTool } from '../components/u-value-tool';

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Ist ein niedriger U-Wert besser?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja. Ein niedriger U-Wert bedeutet, dass weniger Wärme durch das Bauteil verloren geht.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kann ich den U-Wert für mehrere Schichten berechnen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja. Das Tool addiert die Wärmewiderstände mehrerer Schichten von innen nach außen und berechnet daraus den Gesamt-U-Wert.',
      },
    },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'U-Wert Rechner',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Browser',
  description:
    'Interaktiver U-Wert Rechner mit Schnellmodus, Detailmodus, Beispielwerten für Deutschland und Erklärungen für Laien.',
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <UValueTool />
    </>
  );
}
