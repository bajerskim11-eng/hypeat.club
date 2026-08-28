import { useEffect, useRef, useState } from "react";
import { Mic, Send } from "lucide-react";
import { AGENTS } from "@/lib/catalog";
import { askBebok } from "@/lib/ask-bebok";
import { useGuide } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type RecCtor = new () => {
  lang: string;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((ev: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
  onend: (() => void) | null;
};

function speak(text: string, pitch: number, rate: number, onEnd: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    onEnd();
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(
    text.replace(/[•]/g, " ").replace(/\n+/g, ". "),
  );
  u.lang = "pl-PL";
  u.pitch = pitch;
  u.rate = rate;
  const voices = window.speechSynthesis.getVoices();
  const pl = voices.find((v) => /^pl/i.test(v.lang));
  if (pl) u.voice = pl;
  u.onend = onEnd;
  u.onerror = onEnd;
  window.speechSynthesis.speak(u);
}

export function ChatPanel() {
  const agentId = useGuide((s) => s.agentId)!;
  const agent = AGENTS[agentId];
  const history = useGuide((s) => s.history);
  const pushTurn = useGuide((s) => s.pushTurn);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [mood, setMood] = useState<"idle" | "talk" | "listen">("idle");
  const [listening, setListening] = useState(false);
  const recRef = useRef<{ stop: () => void } | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const greeted = useRef(false);

  useEffect(() => {
    logRef.current?.scrollTo({ top: 9e9, behavior: "smooth" });
  }, [history, busy]);

  useEffect(() => {
    greeted.current = false;
  }, [agentId]);

  useEffect(() => {
    if (greeted.current || history.length) return;
    greeted.current = true;
    pushTurn({ role: "assistant", text: agent.greeting });
    setMood("talk");
    speak(agent.greeting, agent.speechPitch, agent.speechRate, () => setMood("idle"));
  }, [agent, history.length, pushTurn]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setDraft("");
    pushTurn({ role: "user", text: message });
    setBusy(true);
    try {
      const res = await askBebok({
        data: { agentId, message, history },
      });
      const reply = res.text;
      pushTurn({ role: "assistant", text: reply });
      setMood("talk");
      speak(reply, agent.speechPitch, agent.speechRate, () => setMood("idle"));
    } finally {
      setBusy(false);
    }
  }

  function toggleMic() {
    const w = window as unknown as { SpeechRecognition?: RecCtor; webkitSpeechRecognition?: RecCtor };
    const Rec = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Rec) {
      pushTurn({
        role: "assistant",
        text: "Ta przeglądarka nie rozpoznaje mowy. Wpisz pytanie.",
      });
      return;
    }
    if (recRef.current) {
      recRef.current.stop();
      return;
    }
    const r = new Rec();
    r.lang = "pl-PL";
    r.interimResults = false;
    recRef.current = r;
    setListening(true);
    setMood("listen");
    r.onresult = (ev) => {
      const t = ev.results[0]?.[0]?.transcript ?? "";
      if (t) void send(t);
    };
    r.onend = () => {
      recRef.current = null;
      setListening(false);
      if (!busy) setMood("idle");
    };
    r.start();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative h-56 shrink-0 overflow-hidden bg-muted">
        <div className="absolute inset-0">
          {agent.clip ? (
            <video
              src={agent.clip}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <img
              src={agent.img}
              alt=""
              className="animate-ken h-full w-full object-cover object-top"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
        </div>
        <div className="absolute bottom-[-8px] right-3 w-24">
          <img src={agent.fig} alt="" className="animate-fig w-24 object-contain drop-shadow-lg" />
        </div>
        <div className="absolute bottom-3 left-3 rounded-full bg-card px-3 py-1 text-sm text-foreground shadow-card">
          {mood === "talk" ? `${agent.name} mówi` : mood === "listen" ? "słucha" : "czeka"}
        </div>
      </div>

      <div ref={logRef} className="min-h-0 flex-1 space-y-2.5 overflow-auto px-4 py-3">
        {history.map((t, i) => (
          <div
            key={i}
            className={cn(
              "animate-bubble max-w-[86%] rounded-2xl px-4 py-2.5 text-base leading-relaxed whitespace-pre-wrap",
              t.role === "assistant" ? "bg-card shadow-card" : "ml-auto bg-muted",
            )}
          >
            {t.text}
          </div>
        ))}
        {busy && (
          <div className="w-16 rounded-2xl bg-card px-3 py-3 text-primary shadow-card">
            …
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 px-4 pb-2">
        {agent.chips.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => void send(c)}
            className="rounded-full bg-card px-3 py-2 text-sm text-foreground shadow-card hover:shadow-card-hover"
          >
            {c}
          </button>
        ))}
      </div>

      <form
        className="flex gap-2 border-t border-border px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        onSubmit={(e) => {
          e.preventDefault();
          void send(draft);
        }}
      >
        <Button
          type="button"
          variant={listening ? "default" : "secondary"}
          size="icon"
          onClick={toggleMic}
          aria-label="Mikrofon"
        >
          <Mic className="size-4" />
        </Button>
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Napisz albo użyj mikrofonu"
          aria-label="Wiadomość"
        />
        <Button type="submit" size="icon" disabled={busy} aria-label="Wyślij">
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}
