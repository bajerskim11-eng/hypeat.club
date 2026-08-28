import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as localGuideAnswer, r as SPOT_KNOWLEDGE, t as AGENTS } from "./catalog-McXH5uxQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ask-bebok-CyUPM-co.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var askBebok_createServerFn_handler = createServerRpc({
	id: "3f0c3c837aabee8ab83288453c9926c1f4918840ea2465eda9abef70a5da263d",
	name: "askBebok",
	filename: "src/lib/ask-bebok.ts"
}, (opts) => askBebok.__executeServer(opts));
var askBebok = createServerFn({ method: "POST" }).validator((input) => input).handler(askBebok_createServerFn_handler, async ({ data }) => {
	const agent = AGENTS[data.agentId];
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: true,
		text: localGuideAnswer(agent, data.message),
		source: "local"
	};
	const messages = [
		{
			role: "system",
			content: `Jesteś ${agent.name}, bebok z Katowic. ${agent.role}. ${agent.pitch}
Mówisz po polsku, krótko (max 120 słów), ciepło, bez emoji. Jesteś przewodnikiem kulinarnym HypEat.
Ceny i promocje są orientacyjne — zaznacz, gdy nie masz pewności.
Nie wymyślaj lokali spoza listy. Jeśli pytanie nie o jedzenie, i tak wróć do miasta i stołów.

LOKALE:
${SPOT_KNOWLEDGE}`
		},
		...data.history.slice(-8).map((h) => ({
			role: h.role === "assistant" ? "assistant" : "user",
			content: h.text
		})),
		{
			role: "user",
			content: data.message.slice(0, 500)
		}
	];
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				max_tokens: 280,
				temperature: .6,
				messages
			})
		});
		if (!res.ok) return {
			ok: true,
			text: localGuideAnswer(agent, data.message),
			source: "local"
		};
		return {
			ok: true,
			text: (await res.json()).choices[0]?.message.content?.trim() || localGuideAnswer(agent, data.message),
			source: "grok"
		};
	} catch {
		return {
			ok: true,
			text: localGuideAnswer(agent, data.message),
			source: "local"
		};
	}
});
//#endregion
export { askBebok_createServerFn_handler };
