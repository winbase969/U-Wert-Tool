'use client';

import { useMemo, useState } from 'react';
import {
  componentLabels,
  materials,
  presets,
  quickGuide,
  surfaceResistances,
  type ComponentType,
} from '../lib/uvalue-data';

type Layer = {
  id: string;
  materialId: string;
  thicknessCm: number;
};

const createLayer = (materialId: string, thicknessCm: number): Layer => ({
  id: `${materialId}-${Math.random().toString(36).slice(2, 9)}`,
  materialId,
  thicknessCm,
});

const defaultPreset = presets[0];

const formatNumber = (value: number, digits = 2) =>
  new Intl.NumberFormat('de-DE', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);

const scoreResult = (uValue: number) => {
  if (uValue <= 0.2) {
    return {
      label: 'Sehr stark gedämmt',
      tone: 'excellent',
      text: 'Das ist für Wohngebäude bereits ein sehr guter Bereich. Solche Werte passen oft zu Neubau oder ambitionierter Sanierung.',
    };
  }

  if (uValue <= 0.35) {
    return {
      label: 'Gut',
      tone: 'good',
      text: 'Das Bauteil ist energetisch ordentlich unterwegs und meist klar besser als typischer Altbau-Bestand.',
    };
  }

  if (uValue <= 0.6) {
    return {
      label: 'Mittel',
      tone: 'medium',
      text: 'Das ist oft okay für ältere, teilweise verbesserte Konstruktionen – aber noch mit spürbarem Optimierungspotenzial.',
    };
  }

  return {
    label: 'Eher schwach',
    tone: 'weak',
    text: 'Das deutet auf höhere Wärmeverluste hin. Für Sanierungsüberlegungen lohnt sich ein Blick auf zusätzliche Dämmung oder bessere Bauteile.',
  };
};

const exampleBenchmarks: Record<ComponentType, string[]> = {
  wand: ['Ungedämmter Altbau: ca. 1,3–1,8 W/m²K', 'Sanierte Wand: ca. 0,20–0,35 W/m²K', 'Guter Neubau: oft unter 0,24 W/m²K'],
  dach: ['Schwach gedämmtes Dach: oft > 0,8 W/m²K', 'Solide Sanierung: ca. 0,18–0,30 W/m²K', 'Sehr gut gedämmt: ca. 0,14–0,20 W/m²K'],
  decke: ['Kellerdecke ohne Dämmung: häufig > 1,0 W/m²K', 'Mit Dämmung: grob 0,20–0,35 W/m²K', 'Sehr gut: rund 0,15–0,22 W/m²K'],
  boden: ['Ungedämmt: häufig > 0,8 W/m²K', 'Gedämmt: grob 0,20–0,35 W/m²K', 'Sehr gut: unter 0,20 W/m²K möglich'],
  fenster: ['Alte Fenster: oft 2,7–5,0 W/m²K', '2-fach modernisiert: oft 1,1–1,5 W/m²K', '3-fach Fenster: oft 0,7–1,0 W/m²K'],
  tuer: ['Alte Außentür: oft 2,0–3,5 W/m²K', 'Ordentliche neue Tür: ca. 1,0–1,5 W/m²K', 'Sehr gute Tür: unter 1,0 W/m²K'],
};

export function UValueTool() {
  const [componentType, setComponentType] = useState<ComponentType>(defaultPreset.type);
  const [mode, setMode] = useState<'quick' | 'detail'>('quick');
  const [layers, setLayers] = useState<Layer[]>(
    defaultPreset.layers.map((layer) => createLayer(layer.materialId, layer.thicknessCm)),
  );

  const availableMaterials = useMemo(
    () => materials.filter((material) => material.category.includes(componentType)),
    [componentType],
  );

  const currentPresets = useMemo(
    () => presets.filter((preset) => preset.type === componentType),
    [componentType],
  );

  const calculation = useMemo(() => {
    const rs = surfaceResistances[componentType];

    const resolvedLayers = layers
      .map((layer) => {
        const material = materials.find((entry) => entry.id === layer.materialId);
        if (!material) return null;
        const thicknessM = layer.thicknessCm / 100;
        const resistance = thicknessM / material.lambda;
        return {
          ...layer,
          material,
          thicknessM,
          resistance,
        };
      })
      .filter(Boolean);

    const layerResistance = resolvedLayers.reduce((sum, layer) => sum + layer!.resistance, 0);
    const totalResistance = rs.inside + layerResistance + rs.outside;
    const uValue = totalResistance > 0 ? 1 / totalResistance : 0;

    return {
      resolvedLayers: resolvedLayers as Array<Layer & { material: (typeof materials)[number]; thicknessM: number; resistance: number }>,
      totalResistance,
      uValue,
      surfaceInside: rs.inside,
      surfaceOutside: rs.outside,
      score: scoreResult(uValue),
    };
  }, [componentType, layers]);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((entry) => entry.id === presetId);
    if (!preset) return;
    setComponentType(preset.type);
    setLayers(preset.layers.map((layer) => createLayer(layer.materialId, layer.thicknessCm)));
  };

  const handleTypeChange = (type: ComponentType) => {
    setComponentType(type);
    const matchingPreset = presets.find((preset) => preset.type === type);
    if (matchingPreset) {
      setLayers(matchingPreset.layers.map((layer) => createLayer(layer.materialId, layer.thicknessCm)));
    } else {
      const fallbackMaterial = materials.find((material) => material.category.includes(type));
      if (fallbackMaterial) {
        setLayers([createLayer(fallbackMaterial.id, fallbackMaterial.defaultThicknessCm)]);
      }
    }
  };

  const updateLayer = (layerId: string, next: Partial<Layer>) => {
    setLayers((current) => current.map((layer) => (layer.id === layerId ? { ...layer, ...next } : layer)));
  };

  const addLayer = () => {
    const defaultMaterial = availableMaterials[0];
    if (!defaultMaterial) return;
    setLayers((current) => [...current, createLayer(defaultMaterial.id, defaultMaterial.defaultThicknessCm)]);
  };

  const removeLayer = (layerId: string) => {
    setLayers((current) => current.filter((layer) => layer.id !== layerId));
  };

  return (
    <main className="page-shell">
      <section className="hero card hero-card">
        <div className="hero-topline">SEO-freundliches U-Wert-Tool für Vercel / Next.js</div>
        <div className="hero-actions">
          <a className="back-button" href="https://www.diektec.de" target="_blank" rel="noreferrer">
            ← Zurück zu diektec.de
          </a>
        </div>
        <div className="hero-grid">
          <div>
            <h1>U-Wert berechnen – einfach erklärt, mit Beispielwerten und Schichtaufbau</h1>
            <p className="lead">
              Dieses Tool führt auch Nutzer ohne Bauphysik-Vorkenntnisse Schritt für Schritt zur überschlägigen
              U-Wert-Berechnung. Du kannst entweder schnell mit Standardbauteilen starten oder detailliert mehrere
              Schichten hintereinander aufbauen – von innen nach außen.
            </p>
            <div className="pill-row">
              <span className="pill">Schnellmodus</span>
              <span className="pill">Detailmodus</span>
              <span className="pill">Beispielwerte für Deutschland</span>
              <span className="pill">SEO-optimierte Inhalte</span>
            </div>
          </div>
          <aside className="hero-side">
            <h2>Was ist ein U-Wert?</h2>
            <p>
              Der U-Wert beschreibt, wie viel Wärme durch ein Bauteil verloren geht. Je <strong>kleiner</strong> der
              Wert, desto <strong>besser</strong> dämmt das Bauteil. Die Einheit ist W/m²K.
            </p>
            <ul>
              <li>Hoher U-Wert = mehr Wärmeverlust</li>
              <li>Niedriger U-Wert = bessere Dämmung</li>
              <li>Gut für erste Sanierungs- und Vergleichsentscheidungen</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="guide-grid">
        {quickGuide.map((item) => (
          <article key={item.title} className="card info-card">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="workspace-grid">
        <section className="card controls-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Schritt 1</p>
              <h2>Bauteil und Modus auswählen</h2>
            </div>
            <p className="muted">Von Wand bis Fenster – inklusive typischer deutscher Standardaufbauten.</p>
          </div>

          <div className="segmented-control">
            {(['quick', 'detail'] as const).map((entry) => (
              <button
                key={entry}
                type="button"
                className={mode === entry ? 'segment active' : 'segment'}
                onClick={() => setMode(entry)}
              >
                {entry === 'quick' ? 'Schnell schätzen' : 'Detailliert aufbauen'}
              </button>
            ))}
          </div>

          <div className="chip-grid">
            {(Object.keys(componentLabels) as ComponentType[]).map((type) => (
              <button
                key={type}
                type="button"
                className={componentType === type ? 'chip active' : 'chip'}
                onClick={() => handleTypeChange(type)}
              >
                {componentLabels[type]}
              </button>
            ))}
          </div>

          <div className="card inset-card">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Schritt 2</p>
                <h3>Mit Beispielaufbau starten</h3>
              </div>
              <p className="muted">Perfekt für Nutzer, die schnell zu einem plausiblen Startwert kommen möchten.</p>
            </div>

            <div className="preset-list">
              {currentPresets.map((preset) => (
                <button key={preset.id} type="button" className="preset-item" onClick={() => applyPreset(preset.id)}>
                  <div>
                    <strong>{preset.title}</strong>
                    <p>{preset.summary}</p>
                  </div>
                  <span>Übernehmen</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card inset-card">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Schritt 3</p>
                <h3>Schichten anpassen</h3>
              </div>
              <p className="muted">Reihenfolge: innen → außen. Je Schicht wird der Wärmewiderstand automatisch addiert.</p>
            </div>

            <div className="layer-stack">
              {layers.map((layer, index) => {
                const material = materials.find((entry) => entry.id === layer.materialId);
                if (!material) return null;

                const layerMaterials = availableMaterials;

                return (
                  <div className="layer-card" key={layer.id}>
                    <div className="layer-header">
                      <div>
                        <span className="layer-badge">Schicht {index + 1}</span>
                        <p className="muted small">{index === 0 ? 'Innenseite' : index === layers.length - 1 ? 'Außenseite' : 'Zwischenschicht'}</p>
                      </div>
                      {mode === 'detail' && layers.length > 1 ? (
                        <button type="button" className="text-button" onClick={() => removeLayer(layer.id)}>
                          Entfernen
                        </button>
                      ) : null}
                    </div>

                    <label>
                      <span>Material / Standardbauteil</span>
                      <select
                        value={layer.materialId}
                        onChange={(event) => {
                          const nextMaterial = materials.find((entry) => entry.id === event.target.value);
                          updateLayer(layer.id, {
                            materialId: event.target.value,
                            thicknessCm: nextMaterial?.defaultThicknessCm ?? layer.thicknessCm,
                          });
                        }}
                      >
                        {layerMaterials.map((entry) => (
                          <option key={entry.id} value={entry.id}>
                            {entry.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="slider-row">
                      <label>
                        <span>Dicke: {formatNumber(layer.thicknessCm, 1)} cm</span>
                        <input
                          type="range"
                          min={material.minThicknessCm}
                          max={material.maxThicknessCm}
                          step={material.stepCm ?? 1}
                          value={layer.thicknessCm}
                          onChange={(event) => updateLayer(layer.id, { thicknessCm: Number(event.target.value) })}
                        />
                      </label>
                      <label>
                        <span>Oder exakt eingeben</span>
                        <input
                          type="number"
                          min={material.minThicknessCm}
                          max={material.maxThicknessCm}
                          step={material.stepCm ?? 1}
                          value={layer.thicknessCm}
                          onChange={(event) => updateLayer(layer.id, { thicknessCm: Number(event.target.value) })}
                        />
                      </label>
                    </div>

                    <div className="material-meta">
                      <p>
                        <strong>λ-Wert:</strong> {formatNumber(material.lambda, 3)} W/mK
                      </p>
                      <p>{material.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {mode === 'detail' ? (
              <button type="button" className="primary-button" onClick={addLayer}>
                + Weitere Schicht hinzufügen
              </button>
            ) : (
              <p className="muted small">
                Im Schnellmodus bleibt die Bedienung bewusst simpel. Wechsle auf <strong>Detailliert</strong>, wenn du
                mehrere Schichten manuell ergänzen möchtest.
              </p>
            )}
          </div>
        </section>

        <aside className="results-column">
          <section className="card result-card">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Ergebnis</p>
                <h2>Gesamt-U-Wert deines Bauteils</h2>
              </div>
              <span className={`score-pill ${calculation.score.tone}`}>{calculation.score.label}</span>
            </div>

            <div className="result-number">{formatNumber(calculation.uValue, 2)} W/m²K</div>
            <p className="lead-small">{calculation.score.text}</p>

            <div className="result-grid">
              <div>
                <span>Innenoberfläche Rsi</span>
                <strong>{formatNumber(calculation.surfaceInside, 2)} m²K/W</strong>
              </div>
              <div>
                <span>Schichten gesamt</span>
                <strong>{formatNumber(calculation.totalResistance - calculation.surfaceInside - calculation.surfaceOutside, 2)} m²K/W</strong>
              </div>
              <div>
                <span>Außenoberfläche Rse</span>
                <strong>{formatNumber(calculation.surfaceOutside, 2)} m²K/W</strong>
              </div>
              <div>
                <span>Gesamtwiderstand</span>
                <strong>{formatNumber(calculation.totalResistance, 2)} m²K/W</strong>
              </div>
            </div>

            <div className="formula-box">
              <p>
                <strong>Rechenweg:</strong> U = 1 / (Rsi + Σ(d / λ) + Rse)
              </p>
              <p>
                Dabei ist <strong>d</strong> die Dicke in Metern und <strong>λ</strong> die Wärmeleitfähigkeit des
                Materials.
              </p>
            </div>
          </section>

          <section className="card detail-card">
            <h3>So setzt sich der Wert zusammen</h3>
            <ol className="resistance-list">
              {calculation.resolvedLayers.map((layer) => (
                <li key={layer.id}>
                  <div>
                    <strong>{layer.material.name}</strong>
                    <p>
                      {formatNumber(layer.thicknessCm, 1)} cm / λ {formatNumber(layer.material.lambda, 3)} = R{' '}
                      {formatNumber(layer.resistance, 3)} m²K/W
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="card detail-card">
            <h3>Typische Vergleichswerte für {componentLabels[componentType]}</h3>
            <ul className="benchmark-list">
              {exampleBenchmarks[componentType].map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </section>
        </aside>
      </section>

      <section className="content-grid">
        <article className="card content-card">
          <h2>Für wen ist dieses U-Wert-Tool gedacht?</h2>
          <p>
            Für Hausbesitzer, Käufer, Sanierer, Makler oder Planer, die schnell verstehen möchten, wie gut eine Wand,
            ein Dach, eine Decke, ein Boden, ein Fenster oder eine Tür ungefähr dämmt. Das Tool ist bewusst so gebaut,
            dass man ohne Fachwissen starten kann.
          </p>
          <ul>
            <li>Nutze den Schnellmodus für eine erste Einschätzung.</li>
            <li>Nutze den Detailmodus für mehrere Schichten und realistischere Aufbauten.</li>
            <li>Vergleiche Varianten, indem du einfach Dämmstärken per Regler änderst.</li>
          </ul>
        </article>

        <article className="card content-card">
          <h2>Wichtige Hinweise zur Genauigkeit</h2>
          <p>
            Die Berechnung ist eine <strong>überschlägige Orientierung</strong>. Reale Bauteile können durch Wärmebrücken,
            Feuchtigkeit, Holzanteile, Luftschichten, Einbausituationen oder normgerechte Randbedingungen abweichen.
          </p>
          <p>
            Wenn du eine Fördermaßnahme, einen Bauantrag, einen Energieausweis oder einen verbindlichen Sanierungsfahrplan
            vorbereitest, sollte ein Energieberater oder Fachplaner die Werte detailliert prüfen.
          </p>
        </article>
      </section>

      <section className="faq-grid">
        <article className="card faq-card">
          <h2>FAQ: Häufige Fragen zum U-Wert</h2>
          <div className="faq-list">
            <div>
              <h3>Ist ein niedriger oder hoher U-Wert besser?</h3>
              <p>Ein niedriger U-Wert ist besser, weil dann weniger Wärme durch das Bauteil verloren geht.</p>
            </div>
            <div>
              <h3>Kann ich mehrere Materialien hintereinander rechnen?</h3>
              <p>
                Ja. Genau dafür ist der Detailmodus gedacht: Du legst jede Schicht nacheinander an und erhältst daraus
                den Gesamt-U-Wert des gesamten Bauteils.
              </p>
            </div>
            <div>
              <h3>Welche Bauteile kann ich berechnen?</h3>
              <p>Außenwände, Dächer, Decken, Böden, Fenster und Türen – jeweils mit typischen Beispielwerten.</p>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
