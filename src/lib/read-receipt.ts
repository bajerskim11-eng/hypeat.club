import { createServerFn } from "@tanstack/react-start";
import { FOOD_SPOTS } from "./catalog";

type Payload = { image: string; hintSpotId?: string | null };

export const readReceipt = createServerFn({ method: "POST" })
  .validator((input: Payload) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    const names = FOOD_SPOTS.map((s) => `${s.id}=${s.name}`).join("; ");
    if (!apiKey) {
      return { ok: true as const, amount: null as number | null, spotId: data.hintSpotId ?? null, source: "none" as const };
    }
    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          max_tokens: 120,
          temperature: 0,
          messages: [
            {
              role: "system",
              content:
                'Odczytujesz polski paragon restauracyjny. Zwróć wyłącznie JSON: {"amount":liczba,"spotId":"id albo null"}. amount to suma do zapłaty w zł. spotId z listy jeśli widać nazwę lokalu. Bez markdown.',
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Lokale: ${names}. Podpowiedź lokalu: ${data.hintSpotId ?? "brak"}.`,
                },
                { type: "image_url", image_url: { url: data.image } },
              ],
            },
          ],
        }),
      });
      if (!res.ok) {
        return { ok: true as const, amount: null as number | null, spotId: data.hintSpotId ?? null, source: "none" as const };
      }
      const body = (await res.json()) as { choices: { message: { content: string } }[] };
      const text = body.choices[0]?.message.content ?? "";
      const json = text.match(/\{[\s\S]*\}/)?.[0];
      if (!json) {
        return { ok: true as const, amount: null as number | null, spotId: data.hintSpotId ?? null, source: "grok" as const };
      }
      const parsed = JSON.parse(json) as { amount?: number; spotId?: string | null };
      const amount = typeof parsed.amount === "number" && parsed.amount > 0 ? Math.round(parsed.amount * 100) / 100 : null;
      const spotId =
        parsed.spotId && FOOD_SPOTS.some((s) => s.id === parsed.spotId) ? parsed.spotId : (data.hintSpotId ?? null);
      return { ok: true as const, amount, spotId, source: "grok" as const };
    } catch {
      return { ok: true as const, amount: null as number | null, spotId: data.hintSpotId ?? null, source: "none" as const };
    }
  });
