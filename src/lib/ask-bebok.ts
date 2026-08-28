import { createServerFn } from "@tanstack/react-start";
import { AGENTS, SPOTS, SPOT_KNOWLEDGE, localGuideAnswer, type AgentId } from "./catalog";

type Payload = {
  agentId: AgentId;
  message: string;
  history: { role: "user" | "assistant"; text: string }[];
};

export const askBebok = createServerFn({ method: "POST" })
  .validator((input: Payload) => input)
  .handler(async ({ data }) => {
    const agent = AGENTS[data.agentId];
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: true as const, text: localGuideAnswer(agent, data.message), source: "local" as const };
    }

    const knowledge =
      agent.kind === "all"
        ? SPOT_KNOWLEDGE
        : SPOTS.filter((s) => s.kind === agent.kind)
            .map(
              (s) =>
                `${s.name} | ${s.area} | ${s.kind} | ${s.tag} | ${s.note} | ${s.promo} | wiek ${s.age}`,
            )
            .join("\n");

    const system = `${agent.system}

Mówisz po polsku. Ceny i godziny są orientacyjne — zaznacz niepewność.
Program HypEat (restauracje): 10% rachunku wraca klientowi w punktach (1 pkt = 1 zł), do wydania w dowolnym lokalu sieci. Lokal oddaje 2% tego rachunku na swojego pieska (wirtualna adopcja).
Nie wymyślaj miejsc spoza listy. Jeśli pytanie poza Twoją działką, powiedz kto z drużyny to weźmie (Hopla jedzenie, Podciep historie, Fachura sklepy, Hanys rozrywka, Skarbnik plan dnia).

MIEJSCA:
${knowledge}`;

    const messages = [
      { role: "system", content: system },
      ...data.history.slice(-8).map((h) => ({
        role: h.role === "assistant" ? "assistant" : "user",
        content: h.text,
      })),
      { role: "user", content: data.message.slice(0, 500) },
    ];

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          max_tokens: agent.id === "skarbnik" ? 420 : 280,
          temperature: 0.6,
          messages,
        }),
      });
      if (!res.ok) {
        return { ok: true as const, text: localGuideAnswer(agent, data.message), source: "local" as const };
      }
      const body = (await res.json()) as {
        choices: { message: { content: string } }[];
      };
      const text = body.choices[0]?.message.content?.trim();
      return {
        ok: true as const,
        text: text || localGuideAnswer(agent, data.message),
        source: "grok" as const,
      };
    } catch {
      return { ok: true as const, text: localGuideAnswer(agent, data.message), source: "local" as const };
    }
  });
