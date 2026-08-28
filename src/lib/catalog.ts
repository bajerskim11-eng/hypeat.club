export type AgentId = "skarbnik" | "hopla" | "podciep" | "fachura" | "hanys";
export type SpotKind = "food" | "shop" | "fun" | "story";

export type Agent = {
  id: AgentId;
  name: string;
  role: string;
  pitch: string;
  img: string;
  fig: string;
  clip?: string;
  greeting: string;
  speechPitch: number;
  speechRate: number;
  kind: SpotKind | "all";
  chips: string[];
  system: string;
};

export type Spot = {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  agent: AgentId;
  kind: SpotKind;
  tag: string;
  note: string;
  promo: string;
  age: "all" | "12" | "18";
};

export const AGENTS: Record<AgentId, Agent> = {
  skarbnik: {
    id: "skarbnik",
    name: "Skarbnik",
    role: "Naczelnik — plan dnia z całej drużyny",
    pitch: "Strażnik wiedzy i skarbów podziemi Katowic. Układa dzień: jedzenie, sklepy, rozrywka, historia.",
    img: "/beboki/skarbnik.jpeg",
    fig: "/beboki/figs/skarbnik.png",
    clip: "/beboki/clips/skarbnik.mp4",
    greeting:
      "Jestem Skarbnik. Pod sobą mam czworo: Hopla karmi, Podciep opowiada, Fachura prowadzi po sklepach, Hanys po rozrywce. Powiedz ile masz godzin i z kim idziesz — ułożę dzień.",
    speechPitch: 0.82,
    speechRate: 0.9,
    kind: "all",
    chips: ["Zaplanuj dzień", "Rodzina z dziećmi", "Pół dnia w centrum", "Program 10%"],
    system:
      "Jesteś Skarbnikiem, naczelnym bebokiem Katowic. Składasz plan z wiedzy drużyny: Hopla=jedzenie, Podciep=historie, Fachura=zakupy, Hanys=rozrywka. Odpowiadasz planem w punktach z godzinami (orientacyjnie). Nie wymyślaj miejsc spoza listy. Krótko, dostojeństwo, bez emoji. Max 160 słów.",
  },
  hopla: {
    id: "hopla",
    name: "Hopla",
    role: "Jedzenie — restauracje, kawiarnie, smaki",
    pitch: "Awatar od stołów. Wie, gdzie zjeść śniadanie, obiad i kolację.",
    img: "/beboki/hopla.jpeg",
    fig: "/beboki/figs/hopla.png",
    greeting:
      "Hop. Ja od jedzenia. Śniadanie na Rynku, śląski obiad, pizza na Mariackiej, kolacja z widokiem. Mów, na co masz ochotę.",
    speechPitch: 1.12,
    speechRate: 1.04,
    kind: "food",
    chips: ["Śląski obiad", "Program 10%", "Który piesek", "Lunch do 50 zł", "Dla dzieci"],
    system:
      "Jesteś Hoplą, bebokiem od jedzenia w Katowicach. Polecasz tylko lokale kind=food. Program HypEat: 10% rachunku wraca w punktach (1 pkt = 1 zł), punkty wydajesz w dowolnej restauracji sieci. Restauracje oddają 2% obrotu na wirtualną adopcję konkretnego pieska. Ceny orientacyjne. Ciepło, krótko, bez emoji. Max 130 słów.",
  },
  podciep: {
    id: "podciep",
    name: "Podciep",
    role: "Latarnik — historie Katowic",
    pitch: "Świeci lampą przez familoki, kopalnie i wieże. Opowiada miasto.",
    img: "/beboki/podciep.jpeg",
    fig: "/beboki/figs/podciep.png",
    greeting:
      "Lampę zapaliłem. Opowiadam Katowice: Nikiszowiec, Muzeum Śląskie, Spodek, drapacz chmur. Którą historię chcesz usłyszeć?",
    speechPitch: 0.9,
    speechRate: 0.94,
    kind: "story",
    chips: ["Nikiszowiec", "Spodek", "Muzeum Śląskie", "Skąd wzięły się Katowice"],
    system:
      "Jesteś Podciepem, latarnikiem. Opowiadasz historie Katowic przy miejscach kind=story. Krótka opowieść + gdzie stanąć. Bez emoji. Max 140 słów.",
  },
  fachura: {
    id: "fachura",
    name: "Fachura",
    role: "Sklepy — gdzie co kupić",
    pitch: "Dwa kilofy i lista zakupów. Galerie, rękodzieło, śląskie pamiątki.",
    img: "/beboki/fachura.jpeg",
    fig: "/beboki/figs/fachura.png",
    greeting:
      "Kilofy gotowe. Ja wiem, gdzie co kupić: Galeria Katowicka, Silesia, pamiątki na Nikiszu, Mariacka. Czego szukasz?",
    speechPitch: 1.0,
    speechRate: 1.06,
    kind: "shop",
    chips: ["Pamiątki", "Galeria", "Dla dziecka", "Design na Mariackiej"],
    system:
      "Jesteś Fachurą, bebokiem od zakupów. Polecasz tylko kind=shop. Mów co tam kupić. Krótko, konkret, bez emoji. Max 120 słów.",
  },
  hanys: {
    id: "hanys",
    name: "Hanys",
    role: "Rozrywka — koncerty, park, kino, Spodek",
    pitch: "Jo wiem kaj sie bawić. Spodek, NOSPR, park, kino.",
    img: "/beboki/hanys.jpeg",
    fig: "/beboki/figs/hanys.png",
    greeting:
      "Jo od rozrywki. Spodek, NOSPR, Rialto, Park Kościuszki, street art. Godomy, na co masz ochotę dzisiaj.",
    speechPitch: 0.84,
    speechRate: 0.96,
    kind: "fun",
    chips: ["Co robić z dziećmi", "Wieczór", "Muzyka", "Park i spacer"],
    system:
      "Jesteś Hanysem, bebokiem od rozrywki w Katowicach. Polecasz kind=fun. Godka lekko śląska, bez przesady. Bez emoji. Max 120 słów.",
  },
};

export const SPOTS: Spot[] = [
  {
    id: "aioli",
    name: "AiOLI inspired by Katowice",
    area: "Rynek 5",
    lat: 50.2596,
    lng: 19.0216,
    agent: "hopla",
    kind: "food",
    tag: "śniadania · rodzinnie",
    note: "Śniadania, burgery, brunche. Orientacyjnie 30–70 zł.",
    promo: "Punkt Hopli na Rynku.",
    age: "all",
  },
  {
    id: "basiliana",
    name: "Basiliana",
    area: "Mariacka 24",
    lat: 50.2578,
    lng: 19.0257,
    agent: "hopla",
    kind: "food",
    tag: "pizza · ogródek",
    note: "Kuchnia włoska, pizza, ogródek na Mariackiej.",
    promo: "Wieczór na Mariackiej.",
    age: "all",
  },
  {
    id: "zurownia",
    name: "Żurownia",
    area: "centrum",
    lat: 50.2558,
    lng: 19.0239,
    agent: "hopla",
    kind: "food",
    tag: "śląskie · żur",
    note: "Hajer, Ślązak, kulebele — żur i klasyka w nowej formie.",
    promo: "Śląski obiad u Hopli.",
    age: "all",
  },
  {
    id: "kaktusy",
    name: "Kaktusy Kato",
    area: "Plac Dworcowy",
    lat: 50.2587,
    lng: 19.0178,
    agent: "hopla",
    kind: "food",
    tag: "lunch · dworzec",
    note: "Śląskie i europejskie, lunch pn–pt 12–14.",
    promo: "Lunch po pociągu.",
    age: "all",
  },
  {
    id: "sztolnia",
    name: "Sztolnia · Chleb Mięso Wino",
    area: "Silesia City Center",
    lat: 50.2709,
    lng: 19.0024,
    agent: "hopla",
    kind: "food",
    tag: "steak · kopalnia",
    note: "Steki, burger, lunch tygodniowy 12–16 w hali kopalni.",
    promo: "Obiad przy galerii.",
    age: "all",
  },
  {
    id: "max",
    name: "Max (tył Spodka)",
    area: "al. Korfantego 35",
    lat: 50.266,
    lng: 19.0255,
    agent: "hopla",
    kind: "food",
    tag: "klasyk · Spodek",
    note: "Stare menu Maksa, tył Spodka / lodowisko.",
    promo: "Po koncercie w Spodku.",
    age: "all",
  },
  {
    id: "byfyj",
    name: "Cafe Byfyj",
    area: "Nikiszowiec",
    lat: 50.2463,
    lng: 19.0814,
    agent: "hopla",
    kind: "food",
    tag: "kawa · familok",
    note: "Kawa i kuchnia inspirowana Śląskiem w Nikiszowcu.",
    promo: "Przerwa między historiami Podciepa.",
    age: "all",
  },
  {
    id: "nikisz",
    name: "Nikiszowiec",
    area: "familoki, pl. Wyzwolenia",
    lat: 50.2465,
    lng: 19.081,
    agent: "podciep",
    kind: "story",
    tag: "osiedle górnicze · cegła",
    note: "Osiedle z 1908–1918 dla górników Giesche. Czerwona cegła, podwórka-studnie, kościół św. Anny. Dziś żywa dzielnica, nie skansen.",
    promo: "Tu Podciep opowiada najdłużej.",
    age: "all",
  },
  {
    id: "muzeum",
    name: "Muzeum Śląskie",
    area: "T. Dobrowolskiego 1, strefa kultury",
    lat: 50.2637,
    lng: 19.0355,
    agent: "podciep",
    kind: "story",
    tag: "muzeum · strefa kultury",
    note: "Gmach wkopany w ziemię na terenie dawnej kopalni Katowice. Historia Górnego Śląska, sztuka, światło z tarasu.",
    promo: "Serce opowieści Podciepa.",
    age: "all",
  },
  {
    id: "spodek-story",
    name: "Spodek",
    area: "al. Korfantego 35",
    lat: 50.2663,
    lng: 19.027,
    agent: "podciep",
    kind: "story",
    tag: "ikona · 1971",
    note: "Hala z 1971, konstrukcja tensowa. Katowice pokazały światu, że górnicze miasto może być futurystyczne. Dziś koncerty i sport.",
    promo: "Latarnia przy talerzu.",
    age: "all",
  },
  {
    id: "drapacz",
    name: "Drapacz Chmur",
    area: "Żwirki i Wigury / Żelazna",
    lat: 50.2572,
    lng: 19.0158,
    agent: "podciep",
    kind: "story",
    tag: "modernizm · 1934",
    note: "Jeden z pierwszych wieżowców w Polsce (1930–34). Śląsk budował wysoko, zanim Warszawa zdążyła.",
    promo: "Krótka opowieść na przejściu.",
    age: "all",
  },
  {
    id: "mhk",
    name: "Muzeum Historii Katowic",
    area: "ks. Szafranka / Nikiszowiec filia",
    lat: 50.2591,
    lng: 19.0219,
    agent: "podciep",
    kind: "story",
    tag: "miasto · izba",
    note: "Jak wieś Kuźnica Bogucka stała się miastem (1865), potem stolicą województwa. Filia na Nikiszu pokazuje mieszkanie górnicze.",
    promo: "Od wsi do metropolii.",
    age: "all",
  },
  {
    id: "galeria-kato",
    name: "Galeria Katowicka",
    area: "3 Maja / dworzec",
    lat: 50.2576,
    lng: 19.0172,
    agent: "fachura",
    kind: "shop",
    tag: "mall · dworzec",
    note: "Nad dworcem: odzież, apteki, księgarnia, spożywcze. Szybkie zakupy przy pociągu.",
    promo: "Fachura przy peronie.",
    age: "all",
  },
  {
    id: "silesia",
    name: "Silesia City Center",
    area: "Chorzowska 107",
    lat: 50.2712,
    lng: 19.003,
    agent: "fachura",
    kind: "shop",
    tag: "duża galeria",
    note: "Wielka galeria przy dawnej kopalni. Moda, elektronika, jedzenie. Obok Sztolnia.",
    promo: "Pełna lista zakupów.",
    age: "all",
  },
  {
    id: "nikisz-craft",
    name: "Nikisz — pamiątki i rzemiosło",
    area: "Nikiszowiec, wokół rynku",
    lat: 50.2468,
    lng: 19.0816,
    agent: "fachura",
    kind: "shop",
    tag: "ceramika · śląskie",
    note: "Galeria, warsztaty, ceglane pamiątki, grafiki familoków. Lepsze niż magnes z dworca.",
    promo: "Śląsk do walizki.",
    age: "all",
  },
  {
    id: "mariacka-shop",
    name: "Mariacka — butiki i winyle",
    area: "ul. Mariacka",
    lat: 50.2579,
    lng: 19.0255,
    agent: "fachura",
    kind: "shop",
    tag: "design · wieczór",
    note: "Małe sklepy: biżuteria, płyty, ubrania. Spacer z zakupem, nie centrum handlowe.",
    promo: "Fachura po kocie dachy.",
    age: "all",
  },
  {
    id: "spodek-fun",
    name: "Spodek — koncert i sport",
    area: "al. Korfantego 35",
    lat: 50.2662,
    lng: 19.0268,
    agent: "hanys",
    kind: "fun",
    tag: "arena",
    note: "Koncerty, hokej, eventy. Sprawdź afisz przed wyjściem.",
    promo: "Hanys pod talerzem.",
    age: "all",
  },
  {
    id: "nospr",
    name: "NOSPR",
    area: "plac Wojciecha Kilara 1",
    lat: 50.2634,
    lng: 19.0368,
    agent: "hanys",
    kind: "fun",
    tag: "filharmonia · strefa kultury",
    note: "Narodowa Orkiestra Symfoniczna. Sala z drewna, świetna akustyka. Obok muzeum i MCK.",
    promo: "Wieczór bez hałasu ulicy.",
    age: "all",
  },
  {
    id: "rialto",
    name: "Kinoteatr Rialto",
    area: "Świętego Jana 24",
    lat: 50.2584,
    lng: 19.0224,
    agent: "hanys",
    kind: "fun",
    tag: "kino · scena",
    note: "Dawne kino, dziś repertuar ambitny i koncerty kameralne. Centrum, 10 min od Rynku.",
    promo: "Hanys na fotelu.",
    age: "12",
  },
  {
    id: "park",
    name: "Park im. Kościuszki",
    area: "Kościuszki / wieża spadochronowa",
    lat: 50.2478,
    lng: 19.0155,
    agent: "hanys",
    kind: "fun",
    tag: "park · rodzinnie",
    note: "Duży park, kościółek, wieża spadochronowa (pomnik 1939). Spacer, plac zabaw, oddech od betonu.",
    promo: "Rozrywka bez biletu.",
    age: "all",
  },
  {
    id: "mck",
    name: "Międzynarodowe Centrum Kongresowe",
    area: "strefa kultury, obok Spodka",
    lat: 50.2652,
    lng: 19.0288,
    agent: "hanys",
    kind: "fun",
    tag: "eventy · targi",
    note: "Zielony dach, konwenty, targi, Intel Extreme Masters. Kiedy jest event — miasto pulsuje.",
    promo: "Sprawdź kalendarz.",
    age: "all",
  },
];

export const FOOD_SPOTS = SPOTS.filter((s) => s.kind === "food");

export const SPOT_KNOWLEDGE = SPOTS.map(
  (s) =>
    `${s.name} | ${s.area} | ${s.kind} | agent ${s.agent} | ${s.tag} | ${s.note} | ${s.promo} | wiek ${s.age}`,
).join("\n");

export function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) {
  const R = 6371e3;
  const to = (x: number) => (x * Math.PI) / 180;
  const dLat = to(lat2 - lat1);
  const dLng = to(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(to(lat1)) * Math.cos(to(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function localGuideAnswer(agent: Agent, text: string) {
  const t = text.toLowerCase();
  const pool =
    agent.kind === "all" ? SPOTS : SPOTS.filter((s) => s.kind === agent.kind);

  if (agent.id === "skarbnik" || /plan|dzień|dzien|rodzin|wieczór|wieczor/.test(t)) {
    const food = SPOTS.find((s) => s.id === "aioli")!;
    const story = SPOTS.find((s) => s.id === "muzeum")!;
    const shop = SPOTS.find((s) => s.id === "galeria-kato")!;
    const fun = SPOTS.find((s) => s.id === "park")!;
    const lunch = SPOTS.find((s) => s.id === "zurownia")!;
    return `${agent.greeting}

Przykładowy dzień:
• 9:30 śniadanie — ${food.name} (${food.area}). Hopla.
• 11:00 historia — ${story.name}. Podciep opowie o kopalni pod muzeum.
• 13:00 obiad — ${lunch.name}. Znowu Hopla.
• 15:00 zakupy — ${shop.name}. Fachura.
• 16:30 oddech — ${fun.name}. Hanys.

Powiedz budżet i czy są dzieci — przesunę punkty.`;
  }

  let hits = pool.filter(
    (s) =>
      t.split(/\s+/).some((w) => w.length > 3 && (s.name + s.tag + s.note).toLowerCase().includes(w)),
  );
  if (!hits.length) hits = pool.slice(0, 4);
  const lines = hits.slice(0, 4).map((s) => `• ${s.name} (${s.area}) — ${s.note}`);
  return `${agent.greeting}\n\n${lines.join("\n")}`;
}
