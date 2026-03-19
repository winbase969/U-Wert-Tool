# U-Wert Tool

Ein geführtes U-Wert-Berechnungstool auf Basis von Next.js, optimiert für den Deploy auf Vercel.

## Features

- Schnellmodus für überschlägige U-Werte
- Detailmodus mit mehreren Schichten von innen nach außen
- Beispielaufbauten für Wand, Dach, Decke, Boden, Fenster und Türen
- SEO-Metadaten, `robots.ts`, `sitemap.ts` und JSON-LD für FAQ/WebApplication
- Nutzerfreundliche Erläuterungen für Laien
- Button zurück zu https://www.diektec.de

## Lokal starten

```bash
npm install
npm run dev
```

## Deploy auf Vercel

1. Repository zu GitHub pushen.
2. In Vercel importieren.
3. Framework Preset `Next.js` verwenden.
4. Als Root Directory das Repository selbst auswählen.
5. Deploy starten.

## Falls in Vercel ein 404 erscheint

- prüfen, ob wirklich das Root-Verzeichnis dieses Repos deployt wird
- prüfen, ob der Build erfolgreich war und ein Deployment erzeugt wurde
- sicherstellen, dass Vercel das Framework als `Next.js` erkannt hat
- bei einem Monorepo nicht versehentlich ein leeres Unterverzeichnis auswählen

- prüfen, ob TypeScript-Pfade/Aliasse korrekt aufgelöst werden oder relative Imports verwenden
