import { Link } from "@tanstack/react-router";
import { AGENTS, type AgentId } from "@/lib/catalog";
import { useGuide } from "@/lib/store";

const ORDER: AgentId[] = ["hopla", "podciep", "fachura", "hanys", "skarbnik"];

export function PickScreen() {
  const setAgent = useGuide((s) => s.setAgent);
  const setTab = useGuide((s) => s.setTab);

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 py-8">
      <Link to="/" className="font-display text-xl tracking-tight">
        hypeat.club
      </Link>
      <h1 className="mt-3 font-display text-4xl leading-tight tracking-tight">Wybierz przewodnika</h1>
      <p className="mt-3 max-w-md text-base text-foreground">
        Hopla prowadzi kartę i restauracje. Pozostali — historie, sklepy, rozrywka. Skarbnik złoży dzień, gdy o to poprosisz.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3">
        {ORDER.map((id, i) => {
          const a = AGENTS[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setAgent(id);
                setTab(id === "hopla" ? "karta" : "chat");
              }}
              className="surface animate-rise p-3 text-left transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-card-hover"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className="relative block overflow-hidden rounded-lg">
                {a.clip ? (
                  <video
                    src={a.clip}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-44 w-full object-cover object-top"
                  />
                ) : (
                  <img src={a.img} alt={a.name} className="img-frame h-44 w-full object-cover object-top" />
                )}
                <img src={a.fig} alt="" className="animate-fig absolute -right-1 bottom-0 h-16 w-16 object-contain drop-shadow-md" />
              </span>
              <b className="mt-3 block font-display text-xl text-foreground">{a.name}</b>
              <span className="mt-1 block text-sm text-muted-foreground">{a.role}</span>
            </button>
          );
        })}
      </div>
    </main>
  );
}
