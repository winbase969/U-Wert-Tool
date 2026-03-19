export type ComponentType = 'wand' | 'dach' | 'decke' | 'boden' | 'fenster' | 'tuer';

export type Material = {
  id: string;
  name: string;
  lambda: number;
  category: ComponentType[];
  description: string;
  defaultThicknessCm: number;
  minThicknessCm: number;
  maxThicknessCm: number;
  stepCm?: number;
};

export type PresetLayer = {
  materialId: string;
  thicknessCm: number;
};

export type Preset = {
  id: string;
  title: string;
  type: ComponentType;
  summary: string;
  useCase: string;
  note: string;
  layers: PresetLayer[];
};

export const surfaceResistances: Record<ComponentType, { inside: number; outside: number; label: string }> = {
  wand: { inside: 0.13, outside: 0.04, label: 'Außenwand / Innenwand zur Außenluft' },
  dach: { inside: 0.10, outside: 0.04, label: 'Geneigtes Dach / Dachfläche' },
  decke: { inside: 0.10, outside: 0.04, label: 'Decke zu unbeheiztem Bereich / Außenluft' },
  boden: { inside: 0.17, outside: 0.04, label: 'Boden / Platte gegen Erdreich (vereinfacht)' },
  fenster: { inside: 0.13, outside: 0.04, label: 'Fenster (vereinfachte Betrachtung)' },
  tuer: { inside: 0.13, outside: 0.04, label: 'Außentür (vereinfachte Betrachtung)' },
};

export const componentLabels: Record<ComponentType, string> = {
  wand: 'Wand',
  dach: 'Dach',
  decke: 'Decke',
  boden: 'Boden',
  fenster: 'Fenster',
  tuer: 'Tür',
};

export const materials: Material[] = [
  {
    id: 'innenputz',
    name: 'Innenputz / Kalkzementputz',
    lambda: 0.7,
    category: ['wand', 'decke'],
    description: 'Typische dünne Innenlage, verbessert die Dämmung nur gering.',
    defaultThicknessCm: 1.5,
    minThicknessCm: 0.5,
    maxThicknessCm: 3,
    stepCm: 0.5,
  },
  {
    id: 'gipskarton',
    name: 'Gipskartonplatte',
    lambda: 0.25,
    category: ['wand', 'decke', 'dach'],
    description: 'Oft als innere Bekleidung bei Trockenbau oder Dachausbau.',
    defaultThicknessCm: 1.25,
    minThicknessCm: 1,
    maxThicknessCm: 2.5,
    stepCm: 0.25,
  },
  {
    id: 'ziegel-alt',
    name: 'Vollziegel / altes Mauerwerk',
    lambda: 0.8,
    category: ['wand'],
    description: 'Eher unsaniertes, massives Bestandsmauerwerk.',
    defaultThicknessCm: 24,
    minThicknessCm: 11.5,
    maxThicknessCm: 49,
    stepCm: 0.5,
  },
  {
    id: 'ziegel-modern',
    name: 'Moderne Hochlochziegel',
    lambda: 0.16,
    category: ['wand'],
    description: 'Leichter, deutlich besser dämmender Ziegel.',
    defaultThicknessCm: 36.5,
    minThicknessCm: 24,
    maxThicknessCm: 49,
    stepCm: 0.5,
  },
  {
    id: 'kalksandstein',
    name: 'Kalksandstein',
    lambda: 1.4,
    category: ['wand'],
    description: 'Schweres, tragfähiges Mauerwerk mit geringer Dämmwirkung.',
    defaultThicknessCm: 17.5,
    minThicknessCm: 11.5,
    maxThicknessCm: 30,
    stepCm: 0.5,
  },
  {
    id: 'stahlbeton',
    name: 'Stahlbeton',
    lambda: 2.3,
    category: ['decke', 'boden', 'wand'],
    description: 'Tragfähig, aber wärmetechnisch schwach ohne Zusatzdämmung.',
    defaultThicknessCm: 20,
    minThicknessCm: 10,
    maxThicknessCm: 30,
    stepCm: 1,
  },
  {
    id: 'mineralwolle',
    name: 'Mineralwolle',
    lambda: 0.035,
    category: ['wand', 'dach', 'decke'],
    description: 'Häufige Dämmung für Dach, Fassade und leichte Konstruktionen.',
    defaultThicknessCm: 16,
    minThicknessCm: 4,
    maxThicknessCm: 30,
    stepCm: 1,
  },
  {
    id: 'eps',
    name: 'EPS-Dämmung',
    lambda: 0.035,
    category: ['wand', 'boden'],
    description: 'Typisch für WDVS oder Perimeter-/Bodendämmung in vereinfachter Betrachtung.',
    defaultThicknessCm: 14,
    minThicknessCm: 4,
    maxThicknessCm: 24,
    stepCm: 1,
  },
  {
    id: 'xps',
    name: 'XPS-Dämmung',
    lambda: 0.032,
    category: ['boden', 'dach'],
    description: 'Druckfeste Dämmung, häufig bei Bodenplatten oder Umkehrdächern.',
    defaultThicknessCm: 12,
    minThicknessCm: 4,
    maxThicknessCm: 24,
    stepCm: 1,
  },
  {
    id: 'holz',
    name: 'Massivholz / Brettschichtholz',
    lambda: 0.13,
    category: ['dach', 'decke', 'tuer', 'wand'],
    description: 'Typischer Konstruktionswerkstoff im Holzbau.',
    defaultThicknessCm: 6,
    minThicknessCm: 2,
    maxThicknessCm: 20,
    stepCm: 0.5,
  },
  {
    id: 'estrich',
    name: 'Estrich',
    lambda: 1.4,
    category: ['boden', 'decke'],
    description: 'Innenliegende Lastverteilung, thermisch eher schwach.',
    defaultThicknessCm: 6,
    minThicknessCm: 3,
    maxThicknessCm: 10,
    stepCm: 0.5,
  },
  {
    id: 'luftraum',
    name: 'Ruhende Luftschicht (vereinfacht)',
    lambda: 0.18,
    category: ['wand', 'dach', 'decke'],
    description: 'Nur als grobe Annäherung für Hohlräume nutzen.',
    defaultThicknessCm: 4,
    minThicknessCm: 2,
    maxThicknessCm: 10,
    stepCm: 0.5,
  },
  {
    id: 'fenster-2fach',
    name: 'Fenster 2-fach Verglasung (als Gesamtbauteil)',
    lambda: 1.3,
    category: ['fenster'],
    description: 'Vereinfachter Gesamtwert modernerer älterer Fenster.',
    defaultThicknessCm: 8,
    minThicknessCm: 4,
    maxThicknessCm: 12,
    stepCm: 0.5,
  },
  {
    id: 'fenster-3fach',
    name: 'Fenster 3-fach Verglasung (als Gesamtbauteil)',
    lambda: 0.8,
    category: ['fenster'],
    description: 'Vereinfachter Gesamtwert für gute Neubaufenster.',
    defaultThicknessCm: 9,
    minThicknessCm: 6,
    maxThicknessCm: 12,
    stepCm: 0.5,
  },
  {
    id: 'tuer-daemm',
    name: 'Gedämmtes Türblatt',
    lambda: 0.9,
    category: ['tuer'],
    description: 'Vereinfachte Annäherung für moderne Außentüren.',
    defaultThicknessCm: 7,
    minThicknessCm: 4,
    maxThicknessCm: 10,
    stepCm: 0.5,
  },
  {
    id: 'tuer-holz-alt',
    name: 'Alte massive Holztür',
    lambda: 1.8,
    category: ['tuer'],
    description: 'Grobe Annäherung für ungedämmte Bestands-Außentüren.',
    defaultThicknessCm: 4.5,
    minThicknessCm: 3,
    maxThicknessCm: 6,
    stepCm: 0.5,
  },
  {
    id: 'aussenputz',
    name: 'Außenputz',
    lambda: 0.87,
    category: ['wand'],
    description: 'Dünne Außenschicht, üblicherweise geringe Auswirkung.',
    defaultThicknessCm: 2,
    minThicknessCm: 1,
    maxThicknessCm: 3,
    stepCm: 0.5,
  },
  {
    id: 'bitumenbahn',
    name: 'Abdichtung / Bitumenbahn',
    lambda: 0.17,
    category: ['dach', 'boden'],
    description: 'Wird aus Vollständigkeitsgründen mit geringer Dicke geführt.',
    defaultThicknessCm: 0.5,
    minThicknessCm: 0.2,
    maxThicknessCm: 1,
    stepCm: 0.1,
  },
];

export const presets: Preset[] = [
  {
    id: 'wand-altbau-ungedaemmt',
    title: 'Altbau-Außenwand ungedämmt',
    type: 'wand',
    summary: 'Typische grobe Bestandswand mit mäßiger Dämmwirkung.',
    useCase: 'Gut für erste Abschätzung bei unsanierten Häusern vor einer Modernisierung.',
    note: 'Ergebnis ist nur überschlägig. Wärmebrücken, Feuchte und echte Steinsorte bleiben außen vor.',
    layers: [
      { materialId: 'innenputz', thicknessCm: 1.5 },
      { materialId: 'ziegel-alt', thicknessCm: 24 },
      { materialId: 'aussenputz', thicknessCm: 2 },
    ],
  },
  {
    id: 'wand-ks-wdvs',
    title: 'Kalksandstein + WDVS',
    type: 'wand',
    summary: 'Sehr typische sanierte oder neuere Wand mit Dämmverbundsystem.',
    useCase: 'Sinnvoll als Vergleich, wenn du die Stärke des WDVS variieren willst.',
    note: 'Je dicker die Dämmung, desto stärker sinkt der U-Wert – aber mit abnehmendem Grenznutzen.',
    layers: [
      { materialId: 'innenputz', thicknessCm: 1.5 },
      { materialId: 'kalksandstein', thicknessCm: 17.5 },
      { materialId: 'eps', thicknessCm: 16 },
      { materialId: 'aussenputz', thicknessCm: 2 },
    ],
  },
  {
    id: 'dach-steildach',
    title: 'Steildach mit Mineralwolle',
    type: 'dach',
    summary: 'Typischer Dachausbau mit Gipskarton und Zwischensparrendämmung.',
    useCase: 'Ideal, wenn du die Dämmstärke im Dach über einen Regler ausprobieren möchtest.',
    note: 'Holzanteile und Sparren werden hier vereinfacht nicht separat bilanziert.',
    layers: [
      { materialId: 'gipskarton', thicknessCm: 1.25 },
      { materialId: 'mineralwolle', thicknessCm: 20 },
      { materialId: 'holz', thicknessCm: 2.4 },
    ],
  },
  {
    id: 'bodenplatte-gedaemmt',
    title: 'Bodenplatte mit Dämmung',
    type: 'boden',
    summary: 'Häufige Kombination aus Estrich, Dämmung und Stahlbeton.',
    useCase: 'Nützlich für Neubau- oder Sanierungsvergleiche der Bodendämmung.',
    note: 'Erdreichanschluss ist sehr komplex; diese Variante bleibt bewusst vereinfacht.',
    layers: [
      { materialId: 'estrich', thicknessCm: 6 },
      { materialId: 'eps', thicknessCm: 12 },
      { materialId: 'stahlbeton', thicknessCm: 20 },
    ],
  },
  {
    id: 'fenster-neu',
    title: 'Fenster 3-fach verglast',
    type: 'fenster',
    summary: 'Grobe Orientierung für moderne Fenster.',
    useCase: 'Hilft beim schnellen Vergleich zu alten 2-fach Fenstern.',
    note: 'Randverbund, Rahmenanteil und Einbausituation bleiben unberücksichtigt.',
    layers: [{ materialId: 'fenster-3fach', thicknessCm: 9 }],
  },
  {
    id: 'haustuer-modern',
    title: 'Moderne gedämmte Haustür',
    type: 'tuer',
    summary: 'Grobe Einordnung für eine neue Außentür.',
    useCase: 'Gut für den Schnellmodus bei Austausch einer Bestands-Haustür.',
    note: 'Beschläge, Verglasungen und Rahmen beeinflussen den echten Wert zusätzlich.',
    layers: [{ materialId: 'tuer-daemm', thicknessCm: 7 }],
  },
];

export const quickGuide = [
  {
    title: 'Schnellschätzung in 30 Sekunden',
    text: 'Wähle ein Standardbauteil aus, passe 1–2 Dicken mit dem Regler an und lies sofort den überschlägigen U-Wert ab.',
  },
  {
    title: 'Detaillierter Aufbau',
    text: 'Lege mehrere Schichten in der richtigen Reihenfolge an – von innen nach außen – und das Tool berechnet den Gesamt-U-Wert des Bauteils.',
  },
  {
    title: 'Interpretation inklusive',
    text: 'Neben der Zahl bekommst du eine einfache Einordnung, Beispielwerte und Hinweise, was ein guter oder schwacher Wert ungefähr bedeutet.',
  },
];
