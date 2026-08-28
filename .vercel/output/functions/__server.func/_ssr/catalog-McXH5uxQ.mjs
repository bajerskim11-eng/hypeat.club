//#region node_modules/.nitro/vite/services/ssr/assets/catalog-McXH5uxQ.js
var AGENTS = {
	hopla: {
		id: "hopla",
		name: "Hopla",
		role: "Zwiadowczyni — nowości i miejsca dla rodzin",
		pitch: "Skacze pierwsza. Szybko znajdzie coś dobrego w centrum.",
		img: "/beboki/hopla.jpeg",
		greeting: "Hop. Jestem Hopla. Prowadzę po centrum Katowic — Rynek, Mariacka, Spodek. Pytaj o śniadanie, dzieci albo krótką trasę.",
		speechPitch: 1.12,
		speechRate: 1.04
	},
	podciep: {
		id: "podciep",
		name: "Podciep",
		role: "Latarnik — wieczór, spokojne stoły, światło",
		pitch: "Świeci drogę, gdy miasto przygasa.",
		img: "/beboki/podciep.jpeg",
		greeting: "Lampę już zapaliłem. Wieczorem lepiej tam, gdzie ciepło i nie za głośno. Nikiszowiec, widok, Mariacka po zmroku.",
		speechPitch: .9,
		speechRate: .94
	},
	hanys: {
		id: "hanys",
		name: "Hanys",
		role: "Budowniczy — kuchnia śląska",
		pitch: "Rolada, kluski, żur, familok.",
		img: "/beboki/hanys.jpeg",
		greeting: "Jo. Godomy o jedzeniu po naszemu. Jak chcesz śląski obiad — jo wiem kaj: Żurownia, Prohibicja, Byfyj.",
		speechPitch: .84,
		speechRate: .96
	},
	fachura: {
		id: "fachura",
		name: "Fachura",
		role: "Wynalazca — lunch, plan, nowinki",
		pitch: "Układa trasę jak warsztat: cel, czas, budżet.",
		img: "/beboki/fachura.jpeg",
		greeting: "Dwa kilofy gotowe. Lunch po pociągu, Sztolnia, Kaktusy. Mów, ile masz czasu.",
		speechPitch: 1,
		speechRate: 1.06
	}
};
var SPOTS = [
	{
		id: "aioli",
		name: "AiOLI inspired by Katowice",
		area: "Rynek 5",
		lat: 50.2596,
		lng: 19.0216,
		agent: "hopla",
		tag: "centrum · śniadania · rodzinnie",
		dishes: "Śniadania, burgery, brunche. Orientacyjnie 30–70 zł.",
		promo: "Check-in + zdjęcie = pieczątka Hopli.",
		age: "all"
	},
	{
		id: "kaktusy",
		name: "Kaktusy Kato",
		area: "Plac Dworcowy",
		lat: 50.2587,
		lng: 19.0178,
		agent: "fachura",
		tag: "śląskie + europejskie · lunch",
		dishes: "Kuchnia śląska i europejska, dojrzewająca wołowina. Lunch pn–pt 12–14.",
		promo: "Dobry punkt na lunch po pociągu.",
		age: "all"
	},
	{
		id: "basiliana",
		name: "Basiliana",
		area: "Mariacka 24",
		lat: 50.2578,
		lng: 19.0257,
		agent: "hopla",
		tag: "włoskie · pizza · ogródek",
		dishes: "Pizza i kuchnia włoska. Ogródek na Mariackiej.",
		promo: "Wieczór na Mariackiej.",
		age: "all"
	},
	{
		id: "sledz",
		name: "Ambasada śledzia",
		area: "Mariacka 25",
		lat: 50.2579,
		lng: 19.026,
		agent: "podciep",
		tag: "śląski klimat · wieczór",
		dishes: "Śledzie, bar, wieczór na Mariackiej.",
		promo: "18+ wieczorem. Z dziećmi raczej lunch w tygodniu.",
		age: "18"
	},
	{
		id: "zurownia",
		name: "Żurownia",
		area: "centrum",
		lat: 50.2558,
		lng: 19.0239,
		agent: "hanys",
		tag: "żur · rolada · reinterpretacje",
		dishes: "Hajer, Ślązak, kulebele — żur i klasyka w nowej formie.",
		promo: "Pieczątka Hanysa za śląski obiad.",
		age: "all"
	},
	{
		id: "prohibicja",
		name: "Śląska Prohibicja",
		area: "centrum",
		lat: 50.2604,
		lng: 19.0248,
		agent: "hanys",
		tag: "śląskie · europejskie",
		dishes: "Kuchnia polska i śląska, klimat kamienicy.",
		promo: "Kolejny punkt na mapę Hanysa.",
		age: "all"
	},
	{
		id: "sztolnia",
		name: "Sztolnia · Chleb Mięso Wino",
		area: "Silesia City Center, Chorzowska 109",
		lat: 50.2709,
		lng: 19.0024,
		agent: "fachura",
		tag: "steak · lunch tygodniowy · kopalnia",
		dishes: "Steki, burger na własnej bułce, lunch tygodniowy 12–16.",
		promo: "Hala kopalni — naturalny punkt Fachury.",
		age: "all"
	},
	{
		id: "byfyj",
		name: "Cafe Byfyj",
		area: "Nikiszowiec",
		lat: 50.2463,
		lng: 19.0814,
		agent: "podciep",
		tag: "familok · śląskie · kawa",
		dishes: "Kawa i kuchnia inspirowana Śląskiem w Nikiszowcu.",
		promo: "Wyprawa poza centrum. Podciep świeci drogę.",
		age: "all"
	},
	{
		id: "max",
		name: "Max (tył Spodka)",
		area: "al. Korfantego 35",
		lat: 50.266,
		lng: 19.0255,
		agent: "hopla",
		tag: "klasyk · przy Spodku",
		dishes: "Stare menu Maksa w nowym miejscu za lodowiskiem.",
		promo: "Spawn Hopli pod Spodkiem.",
		age: "all"
	},
	{
		id: "altus",
		name: "27th Floor",
		area: "Uniwersytecka 13, Altus",
		lat: 50.2619,
		lng: 19.0236,
		agent: "podciep",
		tag: "widok · kolacja",
		dishes: "Restauracja z widokiem. Raczej kolacja niż obiad z dziećmi.",
		promo: "Latarnia Podciepa na 27. piętrze.",
		age: "12"
	}
];
var SPOT_KNOWLEDGE = SPOTS.map((s) => `${s.name} | ${s.area} | agent ${s.agent} | ${s.tag} | ${s.dishes} | ${s.promo} | wiek ${s.age}`).join("\n");
function haversineMeters(lat1, lng1, lat2, lng2) {
	const R = 6371e3;
	const to = (x) => x * Math.PI / 180;
	const dLat = to(lat2 - lat1);
	const dLng = to(lng2 - lng1);
	const a = Math.sin(dLat / 2) ** 2 + Math.cos(to(lat1)) * Math.cos(to(lat2)) * Math.sin(dLng / 2) ** 2;
	return 2 * R * Math.asin(Math.sqrt(a));
}
function localGuideAnswer(agent, text) {
	const t = text.toLowerCase();
	const pick = (ids) => SPOTS.filter((s) => ids.includes(s.id));
	let hits = [];
	if (/śląsk|slask|rolad|klusk|żur|zur|familok/.test(t)) hits = pick([
		"zurownia",
		"prohibicja",
		"byfyj",
		"kaktusy"
	]);
	else if (/pizza|włos|wlos|wino|mariack/.test(t)) hits = pick(["basiliana", "sledz"]);
	else if (/dzieci|rodzin|śniad|sniad|brunch/.test(t)) hits = pick([
		"aioli",
		"max",
		"byfyj"
	]);
	else if (/steak|mięso|mieso|scc|silesia|sztoln/.test(t)) hits = pick(["sztolnia"]);
	else if (/widok|wież|wiecz|romanty|kolac/.test(t)) hits = pick([
		"altus",
		"sztolnia",
		"basiliana"
	]);
	else if (/tanio|budget|lunch|szybko/.test(t)) hits = pick([
		"zurownia",
		"kaktusy",
		"aioli"
	]);
	else if (/spodek|osada|centrum|gdzie zjeść|gdzie zjesc|restaur/.test(t)) hits = pick([
		"max",
		"aioli",
		"kaktusy",
		"zurownia"
	]);
	else hits = SPOTS.filter((s) => s.agent === agent.id).slice(0, 3);
	if (!hits.length) hits = SPOTS.slice(0, 3);
	const lines = hits.map((s) => `• ${s.name} (${s.area}) — ${s.dishes}`);
	return `${agent.greeting}\n\n${lines.join("\n")}`;
}
//#endregion
export { localGuideAnswer as a, haversineMeters as i, SPOTS as n, SPOT_KNOWLEDGE as r, AGENTS as t };
