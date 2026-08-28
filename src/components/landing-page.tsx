import { useNavigate } from "@tanstack/react-router";
import { Camera, PawPrint, QrCode } from "lucide-react";
import { AGENTS, FOOD_SPOTS, type AgentId } from "@/lib/catalog";
import { DOGS, SPONSOR } from "@/lib/loyalty";
import { useGuide } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { QrImg } from "@/components/qr-img";
import { spotQrValue } from "@/lib/qr";
import { ClubHeader } from "@/components/club-header";

const GUIDES: AgentId[] = ["hopla", "podciep", "fachura", "hanys", "skarbnik"];

export function LandingPage() {
  const navigate = useNavigate();
  const setAgent = useGuide((s) => s.setAgent);
  const setTab = useGuide((s) => s.setTab);

  return (
    <main className="mx-auto min-h-dvh max-w-3xl px-4 pb-16">
      <ClubHeader />

      <section>
        <div className="relative overflow-hidden rounded-3xl shadow-card">
          <img
            src="/beboki/skarbnik.jpeg"
            alt="Skarbnik, naczelnik klubu"
            className="animate-ken h-72 w-full object-cover object-[50%_10%] sm:h-[26rem]"
          />
          <img
            src="/beboki/figs/skarbnik.png"
            alt=""
            className="animate-fig pointer-events-none absolute right-2 bottom-0 w-24 object-contain drop-shadow-lg sm:w-32"
          />
        </div>
        <p className="mt-6 text-sm font-medium tracking-[0.16em] text-primary uppercase">Klub stołów Katowic</p>
        <h1 className="mt-2 font-display text-4xl leading-[1.12] tracking-tight sm:text-5xl">
          Pamiętnik wizyt. Punkty. Pieski.
        </h1>
        <p className="mt-3 max-w-md text-base text-muted-foreground">
          Jesz, wrzucasz paragon, 10% wraca. 2% idzie na pieska lokalu. Relacje za punkty. Skarbnik pilnuje sezonu.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => void navigate({ to: "/login" })}>Zostań członkiem</Button>
          <Button variant="secondary" onClick={() => void navigate({ to: "/tablica" })}>
            Tablica relacji
          </Button>
        </div>
      </section>

      <section className="mt-10 flex justify-center gap-2 sm:gap-4">
        {GUIDES.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setAgent(id);
              setTab(id === "hopla" ? "karta" : "chat");
              void navigate({ to: "/app" });
            }}
            className="flex flex-col items-center"
            aria-label={AGENTS[id].name}
          >
            <img src={AGENTS[id].fig} alt="" className="h-16 w-16 object-contain sm:h-20 sm:w-20" />
            <span className="mt-1 text-xs text-muted-foreground">{AGENTS[id].name}</span>
          </button>
        ))}
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-3">
        {[
          { Icon: QrCode, t: "Paragon do klubu", d: "Skanujesz lokal, fotografujesz rachunek. Wpis ląduje w pamiętniku." },
          { Icon: Camera, t: "Punkty jak sezonówka", d: "10% wraca. Wydajesz w dowolnej restauracji sieci." },
          { Icon: PawPrint, t: "Ślad dla pieska", d: "2% obrotu i odznaki za to, ile już poszło na miskę." },
        ].map((s) => (
          <article key={s.t} className="surface p-5">
            <s.Icon className="size-5 text-primary" />
            <h2 className="mt-3 font-display text-xl">{s.t}</h2>
            <p className="mt-2 text-base text-muted-foreground">{s.d}</p>
          </article>
        ))}
      </section>

      <section className="mt-14 surface p-6">
        <h2 className="font-display text-2xl">Nie budujemy drugiego Instagrama</h2>
        <p className="mt-2 max-w-xl text-base text-muted-foreground">
          Instagram i Google Maps są od oznaczania lokalu i zasięgu. Cashback za zdjęcie, film i opinię musi być w klubie — tam widać innych członków i tam schodzą punkty na darmowy posiłek.
        </p>
        <Button className="mt-4" variant="secondary" onClick={() => void navigate({ to: "/tablica" })}>
          Zobacz tablicę
        </Button>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl">Trzy strony, jeden obrót</h2>
        <p className="mt-2 max-w-xl text-base text-muted-foreground">
          Członek zbiera pamiętnik. Lokal zatwierdza zniżki i przelew. Przytulisko widzi paczki.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <article className="surface p-5">
            <h3 className="font-display text-xl">Członek</h3>
            <p className="mt-2 text-base text-muted-foreground">Konto, paragony, odznaki, dziennik wizyt.</p>
            <Button className="mt-4" onClick={() => void navigate({ to: "/login" })}>
              Dołącz
            </Button>
          </article>
          <article className="surface p-5">
            <h3 className="font-display text-xl">Lokal</h3>
            <p className="mt-2 text-base text-muted-foreground">Kasa: sala albo dowóz, kupony, kawa gratis.</p>
            <Button className="mt-4" variant="secondary" onClick={() => void navigate({ to: "/lokal" })}>
              Wejdź do kasy
            </Button>
          </article>
          <article className="surface p-5">
            <h3 className="font-display text-xl">Schronisko</h3>
            <p className="mt-2 text-base text-muted-foreground">Naliczenia z obrotu i zatwierdzone paczki.</p>
            <Button className="mt-4" variant="secondary" onClick={() => void navigate({ to: "/schronisko" })}>
              Przytulisko Kąsek
            </Button>
          </article>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl">Restauracje w klubie</h2>
        <p className="mt-2 text-base text-muted-foreground">
          Punkty z AiOLI wydajesz w Żurowni, w Sztolni, na Mariackiej — wszędzie w sieci.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {FOOD_SPOTS.map((s) => (
            <article key={s.id} className="surface p-3">
              <QrImg value={spotQrValue(s.id)} label={`Kod ${s.name}`} className="w-full rounded-lg" />
              <p className="mt-2 font-medium">{s.name}</p>
              <p className="text-sm text-muted-foreground">{s.area}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl">Jedzenie wspiera pieski</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {DOGS.map((d) => (
            <article key={d.id} className="surface p-2">
              <img src={d.img} alt={d.name} className="img-frame aspect-square w-full rounded-lg object-cover" />
              <p className="mt-2 font-medium">{d.name}</p>
              <p className="text-sm text-muted-foreground">
                {FOOD_SPOTS.filter((s) => SPONSOR[s.id] === d.id)
                  .map((s) => s.name.split(" ")[0])
                  .join(", ")}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl">Przewodnicy klubu</h2>
        <p className="mt-2 max-w-xl text-base text-muted-foreground">
          Hopla od stołu. Reszta drużyny — historie, sklepy, rozrywka. Skarbnik złoży dzień, gdy poprosisz.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {GUIDES.map((id) => {
            const a = AGENTS[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setAgent(id);
                  setTab(id === "hopla" ? "karta" : "chat");
                  void navigate({ to: "/app" });
                }}
                className="surface p-2 text-left transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <span className="relative block">
                  <img src={a.img} alt="" className="img-frame aspect-[3/4] w-full rounded-lg object-cover object-top" />
                  <img src={a.fig} alt="" className="absolute -right-1 bottom-0 h-12 w-12 object-contain" />
                </span>
                <b className="mt-2 block">{a.name}</b>
                <span className="block text-sm text-muted-foreground">{a.role.split("—")[0]}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="surface mt-14 p-6">
        <h2 className="font-display text-2xl">Sezon otwarty</h2>
        <p className="mt-2 text-base text-muted-foreground">
          Zrób konto, zrób zdjęcie paragonu, zobacz pierwszy wpis i odznakę Pierwszy stół.
        </p>
        <Button className="mt-4" onClick={() => void navigate({ to: "/login" })}>
          Wejdź do hypeat.club
        </Button>
      </div>
    </main>
  );
}
