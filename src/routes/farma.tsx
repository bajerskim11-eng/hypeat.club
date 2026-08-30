import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronDown,
  CircleDollarSign,
  Droplets,
  Factory,
  Heart,
  Leaf,
  Package,
  PawPrint,
  Recycle,
  Sprout,
  Truck,
  Utensils,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/farma")({
  head: () => ({
    meta: [
      { title: "Farma Hypeat — jedzenie, które robi coś dobrego" },
      {
        name: "description",
        content:
          "Farma Hypeat łączy lokalną produkcję żywności, automatyzację i realną pomoc zwierzętom oraz szkołom.",
      },
    ],
  }),
  component: FarmaPage,
});

function FarmaPage() {
  return (
    <main className="farma-page">
      <nav className="farma-nav">
        <Link to="/farma" className="farma-brand">
          <span className="farma-brand-mark"><Sprout size={18} /></span>
          <span>FARMA <b>HYPEAT</b></span>
        </Link>
        <div className="farma-nav-links">
          <a href="#jak-dziala">Jak to działa</a>
          <a href="#zywnosc">Żywność</a>
          <a href="#pomoc">Pomoc</a>
          <a href="#rozwoj">Rozwój farmy</a>
        </div>
        <a className="farma-nav-cta" href="#dolacz">Dołącz do projektu <ArrowRight size={16} /></a>
      </nav>

      <section className="farma-hero">
        <div className="farma-hero-copy">
          <div className="farma-eyebrow"><span /> PROJEKT HYPEAT</div>
          <h1>Budujemy farmę,<br /><em>która karmi i pomaga.</em></h1>
          <p className="farma-hero-lead">
            Lokalna, zautomatyzowana produkcja żywności połączona z dostawami do domu,
            gotowymi posiłkami i funduszem na realną pomoc.
          </p>
          <div className="farma-actions">
            <a className="farma-button primary" href="#dolacz">Chcę być częścią farmy <ArrowRight size={18} /></a>
            <a className="farma-button ghost" href="#jak-dziala">Zobacz, jak to działa <ChevronDown size={17} /></a>
          </div>
          <div className="farma-trust-row">
            <span><Leaf size={15} /> lokalnie</span>
            <span><Zap size={15} /> automatycznie</span>
            <span><Heart size={15} /> społecznie</span>
          </div>
        </div>

        <div className="farma-hero-art" aria-label="Ilustracja farmy Hypeat">
          <div className="farma-sun" />
          <div className="farma-cloud cloud-one" />
          <div className="farma-cloud cloud-two" />
          <div className="farma-hill hill-back" />
          <div className="farma-hill hill-front" />
          <div className="farma-field field-one" />
          <div className="farma-field field-two" />
          <div className="farma-greenhouse">
            <div className="greenhouse-roof" />
            <div className="greenhouse-frame" />
            <div className="greenhouse-glow" />
            <div className="greenhouse-plants"><i /><i /><i /><i /><i /></div>
          </div>
          <div className="farma-data-card card-production">
            <span className="data-icon"><Sprout size={16} /></span>
            <div><b>Produkcja</b><small>sterowana popytem</small></div>
            <strong>AI</strong>
          </div>
          <div className="farma-data-card card-impact">
            <span className="data-icon heart"><Heart size={16} /></span>
            <div><b>Fundusz pomocy</b><small>rośnie z każdym zamówieniem</small></div>
            <strong>+∞</strong>
          </div>
          <div className="farma-plot-label">HYPEAT ECOHUB <span>01</span></div>
        </div>
      </section>

      <section className="farma-statement" id="jak-dziala">
        <div className="farma-section-kicker">NIE CHCEMY TYLKO SPRZEDAWAĆ JEDZENIA</div>
        <h2>Chcemy zbudować system,<br /><em>który sam napędza dobro.</em></h2>
        <p>Każde zamówienie zasila kolejne ogniwo. Im większa społeczność, tym większa produkcja, większa skala i większa pomoc.</p>
        <div className="farma-flow">
          {[
            [Utensils, "Klient", "zamawia"],
            [Sprout, "Farma", "produkuje"],
            [Package, "Food Hub", "pakuje"],
            [Truck, "Dostawa", "dowozi"],
            [Heart, "Fundusz", "pomaga"],
          ].map(([Icon, title, text], index) => (
            <div className="farma-flow-item" key={title as string}>
              <div className="flow-icon"><Icon size={21} /></div>
              <b>{title as string}</b><span>{text as string}</span>
              {index < 4 && <ArrowRight className="flow-arrow" size={18} />}
            </div>
          ))}
        </div>
      </section>

      <section className="farma-feature-section" id="zywnosc">
        <div className="farma-feature-visual">
          <div className="box-shadow" />
          <div className="food-box">
            <div className="box-top"><span>HYPEAT</span><small>FARMA / 01</small></div>
            <div className="box-content">
              <div className="food-orb orb-tomato" />
              <div className="food-orb orb-lettuce" />
              <div className="food-orb orb-herb" />
              <div className="food-card-label"><span>LOCAL FOOD</span><b>Paczka na cały tydzień</b></div>
            </div>
          </div>
          <div className="mini-tag"><Sprout size={14} /> prosto z farmy</div>
        </div>
        <div className="farma-feature-copy">
          <div className="farma-section-kicker">OD UPRAWY DO TWOJEGO STOŁU</div>
          <h2>Nie kupujesz<br /><em>anonimowego jedzenia.</em></h2>
          <p>W przyszłości Hypeat ma łączyć własną produkcję z lokalnymi gospodarstwami i centrum pakowania. Zamawiasz pojedyncze produkty, tygodniowe boxy albo gotowe posiłki.</p>
          <div className="farma-feature-list">
            <div><span><Leaf size={17} /></span><b>Świeże produkty</b><small>warzywa, zioła, owoce, mikrolistki</small></div>
            <div><span><Utensils size={17} /></span><b>Przepisy i gotowanie</b><small>składniki dobrane pod konkretny jadłospis</small></div>
            <div><span><Package size={17} /></span><b>Gotowe diety</b><small>posiłki na cały tydzień, dostarczone pod drzwi</small></div>
          </div>
          <a className="text-link" href="#dolacz">Zobacz model farmy <ArrowRight size={17} /></a>
        </div>
      </section>

      <section className="farma-impact" id="pomoc">
        <div className="impact-head">
          <div><div className="farma-section-kicker light">KAŻDY ZAKUP MA DRUGĄ STRONĘ</div><h2>Jedzenie na stole.<br /><em>Pomoc w świecie.</em></h2></div>
          <p>Budujemy model, w którym część wartości wypracowanej przez biznes wraca do społeczności. Konkretne programy i kwoty będziemy publikować transparentnie.</p>
        </div>
        <div className="impact-grid">
          <article><div className="impact-number">01</div><PawPrint size={29} /><h3>Azyl dla zwierząt</h3><p>Bezpieczne miejsce dla psów i innych zwierząt, z opieką, leczeniem i przestrzenią do życia.</p><span>AZYL HYPEAT</span></article>
          <article><div className="impact-number">02</div><Droplets size={29} /><h3>Czysta woda w szkołach</h3><p>Program wyposażania szkół w rozwiązania do uzdatniania i filtrowania wody.</p><span>HYPEAT WATER</span></article>
          <article><div className="impact-number">03</div><Recycle size={29} /><h3>Nowe życie dla terenów</h3><p>Rewitalizacja nieużytków i terenów poprzemysłowych w miejsca, które znów służą ludziom.</p><span>HYPEAT ECOHUB</span></article>
        </div>
      </section>

      <section className="farma-members" id="rozwoj">
        <div className="farma-members-copy">
          <div className="farma-section-kicker">SPOŁECZNOŚĆ ROŚNIE RAZEM Z FARMĄ</div>
          <h2>Możesz mieć swój<br /><em>kawałek przyszłości.</em></h2>
          <p>Docelowo chcemy stworzyć model członkowski, w którym społeczność finansuje kolejne moduły produkcji i otrzymuje dostęp do ich plonów, produktów oraz specjalnych pakietów.</p>
          <div className="member-options">
            <div><span>01</span><b>Wspieram</b><small>dołączam do budowy projektu</small></div>
            <div><span>02</span><b>Adoptuję moduł</b><small>mam swój fragment produkcji</small></div>
            <div><span>03</span><b>Odbieram plony</b><small>produkty trafiają do mojego domu</small></div>
          </div>
        </div>
        <div className="farm-module-art">
          <div className="module-grid">
            {Array.from({ length: 16 }).map((_, i) => <span key={i} className={i === 5 || i === 6 || i === 9 || i === 10 ? "planted" : ""}><i /></span>)}
          </div>
          <div className="module-label"><span>TWÓJ MODUŁ</span><b>10 m²</b><small>warzywa + zioła</small></div>
          <CircleDollarSign className="module-coin" size={36} />
        </div>
      </section>

      <section className="farma-vision" id="dolacz">
        <div className="vision-glow" />
        <div className="farma-section-kicker">TO DOPIERO POCZĄTEK</div>
        <h2>Najpierw budujemy farmę.<br /><em>Potem budujemy cały ekosystem.</em></h2>
        <p>Od pierwszego boxa, przez własne centrum pakowania, aż po EcoHub z azylem, energią i produkcją żywności. Wszystko po to, żeby biznes finansował dobro, a dobro napędzało biznes.</p>
        <div className="vision-actions"><a className="farma-button primary" href="mailto:kontakt@hypeat.club?subject=Farma Hypeat">Chcę być na starcie <ArrowRight size={18} /></a><a className="farma-button dark" href="/">Wróć do Hypeat</a></div>
        <div className="vision-stats"><span><b>01</b><small>lokalna żywność</small></span><span><b>02</b><small>automatyzacja</small></span><span><b>03</b><small>realna pomoc</small></span><span><b>04</b><small>skalowalny model</small></span></div>
      </section>

      <footer className="farma-footer"><span>© Hypeat Farma</span><span>Projekt koncepcyjny · 2026</span><span>Jedzenie, które robi coś dobrego.</span></footer>
    </main>
  );
}
