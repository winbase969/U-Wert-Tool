import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page-shell">
      <section className="card content-card" style={{ marginTop: 40 }}>
        <p className="eyebrow">404</p>
        <h1>Seite nicht gefunden</h1>
        <p className="lead-small">
          Diese Route existiert nicht. Nutze die Startseite, um den U-Wert-Rechner für Wand, Dach, Boden, Fenster
          oder Türen zu öffnen.
        </p>
        <div className="pill-row">
          <Link className="primary-button" href="/">
            Zur Startseite
          </Link>
          <a className="back-button" href="https://www.diektec.de" target="_blank" rel="noreferrer">
            Zurück zu diektec.de
          </a>
        </div>
      </section>
    </main>
  );
}
