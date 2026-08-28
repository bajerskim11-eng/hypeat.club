import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { i as haversineMeters, n as SPOTS, t as AGENTS } from "./catalog-McXH5uxQ.mjs";
import { a as MessageCircle, i as Mic, n as Send, o as Map, r as Radar, s as CreditCard } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DIKLGhm7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var useGuide = create()(persist((set, get) => ({
	agentId: null,
	tab: "chat",
	points: 0,
	stamps: [],
	pos: null,
	history: [],
	cameraSpotId: null,
	setAgent: (id) => set({
		agentId: id,
		tab: "chat",
		history: []
	}),
	resetAgent: () => set({
		agentId: null,
		tab: "chat",
		history: []
	}),
	setTab: (tab) => set({ tab }),
	addStamp: (spotId, extra = 0) => {
		const { stamps, points } = get();
		if (stamps.includes(spotId)) {
			if (extra) set({ points: points + extra });
			return false;
		}
		set({
			stamps: [...stamps, spotId],
			points: points + 10 + extra
		});
		return true;
	},
	setPos: (pos) => set({ pos }),
	pushTurn: (turn) => set({ history: [...get().history, turn].slice(-24) }),
	clearHistory: () => set({ history: [] }),
	setCameraSpot: (id) => set({ cameraSpotId: id })
}), {
	name: "beboki-hypeat",
	partialize: (s) => ({
		agentId: s.agentId,
		points: s.points,
		stamps: s.stamps
	})
}));
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var askBebok = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("3f0c3c837aabee8ab83288453c9926c1f4918840ea2465eda9abef70a5da263d"));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-11 px-4", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-card text-foreground border border-border hover:bg-muted",
			ghost: "text-foreground hover:bg-muted",
			outline: "border border-border bg-transparent hover:bg-muted"
		},
		size: {
			default: "h-11",
			sm: "h-9 min-h-9 px-3 text-xs",
			icon: "size-11 p-0"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("flex h-11 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
		...props
	});
}
var CHIPS = [
	"Śląski obiad",
	"Coś dla dzieci",
	"Mariacka wieczorem",
	"Lunch do 50 zł",
	"Przy Spodku"
];
function speak(text, pitch, rate, onEnd) {
	if (typeof window === "undefined" || !window.speechSynthesis) {
		onEnd();
		return;
	}
	window.speechSynthesis.cancel();
	const u = new SpeechSynthesisUtterance(text.replace(/[•]/g, " ").replace(/\n+/g, ". "));
	u.lang = "pl-PL";
	u.pitch = pitch;
	u.rate = rate;
	const pl = window.speechSynthesis.getVoices().find((v) => /^pl/i.test(v.lang));
	if (pl) u.voice = pl;
	u.onend = onEnd;
	u.onerror = onEnd;
	window.speechSynthesis.speak(u);
}
function ChatPanel() {
	const agentId = useGuide((s) => s.agentId);
	const agent = AGENTS[agentId];
	const history = useGuide((s) => s.history);
	const pushTurn = useGuide((s) => s.pushTurn);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [mood, setMood] = (0, import_react.useState)("idle");
	const [listening, setListening] = (0, import_react.useState)(false);
	const recRef = (0, import_react.useRef)(null);
	const logRef = (0, import_react.useRef)(null);
	const greeted = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		logRef.current?.scrollTo({
			top: 9e9,
			behavior: "smooth"
		});
	}, [history, busy]);
	(0, import_react.useEffect)(() => {
		if (greeted.current || history.length) return;
		greeted.current = true;
		pushTurn({
			role: "assistant",
			text: agent.greeting
		});
		setMood("talk");
		speak(agent.greeting, agent.speechPitch, agent.speechRate, () => setMood("idle"));
	}, [
		agent,
		history.length,
		pushTurn
	]);
	async function send(text) {
		const message = text.trim();
		if (!message || busy) return;
		setDraft("");
		pushTurn({
			role: "user",
			text: message
		});
		setBusy(true);
		try {
			const reply = (await askBebok({ data: {
				agentId,
				message,
				history
			} })).text;
			pushTurn({
				role: "assistant",
				text: reply
			});
			setMood("talk");
			speak(reply, agent.speechPitch, agent.speechRate, () => setMood("idle"));
		} finally {
			setBusy(false);
		}
	}
	function toggleMic() {
		const w = window;
		const Rec = w.SpeechRecognition || w.webkitSpeechRecognition;
		if (!Rec) {
			pushTurn({
				role: "assistant",
				text: "Ta przeglądarka nie rozpoznaje mowy. Wpisz pytanie."
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
			if (t) send(t);
		};
		r.onend = () => {
			recRef.current = null;
			setListening(false);
			if (!busy) setMood("idle");
		};
		r.start();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-48 shrink-0 overflow-hidden border-b border-border bg-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute bottom-[-18px] left-1/2 w-44 -translate-x-1/2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("origin-bottom", mood === "talk" && "animate-talk", mood === "listen" && "animate-listen", mood === "idle" && "animate-idle"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: agent.img,
							alt: agent.name,
							className: "h-56 w-44 object-cover object-top",
							style: {
								maskImage: "linear-gradient(#000 78%, transparent)",
								WebkitMaskImage: "linear-gradient(#000 78%, transparent)"
							}
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute bottom-3 left-3 rounded-full border border-border bg-card/80 px-3 py-1 text-xs text-primary",
					children: mood === "talk" ? `${agent.name} mówi` : mood === "listen" ? "słucha" : "czeka"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: logRef,
				className: "min-h-0 flex-1 space-y-2.5 overflow-auto px-4 py-3",
				children: [history.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("animate-bubble max-w-[86%] rounded-xl border px-3 py-2 text-sm whitespace-pre-wrap", t.role === "assistant" ? "border-border bg-card" : "ml-auto border-primary/30 bg-muted"),
					children: t.text
				}, i)), busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-16 rounded-xl border border-border bg-card px-3 py-3 text-primary",
					children: "…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2 px-4 pb-2",
				children: CHIPS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void send(c),
					className: "rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground hover:bg-muted",
					children: c
				}, c))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex gap-2 border-t border-border px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
				onSubmit: (e) => {
					e.preventDefault();
					send(draft);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: listening ? "default" : "secondary",
						size: "icon",
						onClick: toggleMic,
						"aria-label": "Mikrofon",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						placeholder: "Napisz albo użyj mikrofonu",
						"aria-label": "Wiadomość"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "icon",
						disabled: busy,
						"aria-label": "Wyślij",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
					})
				]
			})
		]
	});
}
function MapPanel() {
	const host = (0, import_react.useRef)(null);
	const mapRef = (0, import_react.useRef)(null);
	const [spot, setSpot] = (0, import_react.useState)(null);
	const setTab = useGuide((s) => s.setTab);
	const addStamp = useGuide((s) => s.addStamp);
	const pushTurn = useGuide((s) => s.pushTurn);
	const setCameraSpot = useGuide((s) => s.setCameraSpot);
	const setAgent = useGuide((s) => s.setAgent);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const boot = async () => {
			const L = (await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))).default;
			if (cancelled || !host.current || mapRef.current) return;
			const map = L.map(host.current);
			map.setView([50.2596, 19.0216], 14);
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution: "&copy; OpenStreetMap",
				maxZoom: 19
			}).addTo(map);
			SPOTS.forEach((s) => {
				const m = L.circleMarker([s.lat, s.lng], {
					radius: 9,
					color: "#c4b08a",
					fillColor: "#c4b08a",
					fillOpacity: .9,
					weight: 2
				});
				m.addTo(map);
				m.on("click", () => setSpot(s));
			});
			mapRef.current = map;
		};
		boot();
		return () => {
			cancelled = true;
			mapRef.current?.remove();
			mapRef.current = null;
		};
	}, []);
	const ag = spot ? AGENTS[spot.agent] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: host,
			className: "min-h-[240px] flex-1 bg-muted"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-h-[42%] overflow-auto border-t border-border bg-card px-4 py-3",
			children: spot && ag ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg text-primary",
					children: spot.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						spot.area,
						" · ",
						spot.tag,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						spot.dishes
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => {
								const fresh = addStamp(spot.id);
								pushTurn({
									role: "assistant",
									text: fresh ? `Pieczątka zbita: ${spot.name}.` : `Tu już byłeś: ${spot.name}.`
								});
							},
							children: "Check-in"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => setCameraSpot(spot.id),
							children: ["Zdjęcie z ", ag.name]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => {
								setAgent(spot.agent);
								setTab("chat");
								pushTurn({
									role: "assistant",
									text: `${ag.name} przy ${spot.name}. ${spot.dishes} ${spot.promo}`
								});
							},
							children: "Pogadaj"
						})
					]
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-lg text-primary",
				children: "Katowice"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Wybierz pinezkę — lokale to punkty gry terenowej."
			})] })
		})]
	});
}
function HuntPanel() {
	const pos = useGuide((s) => s.pos);
	const setPos = useGuide((s) => s.setPos);
	const addStamp = useGuide((s) => s.addStamp);
	const setCameraSpot = useGuide((s) => s.setCameraSpot);
	const pushTurn = useGuide((s) => s.pushTurn);
	const setTab = useGuide((s) => s.setTab);
	const ranked = SPOTS.map((s) => ({
		s,
		m: pos ? haversineMeters(pos.lat, pos.lng, s.lat, s.lng) : null
	})).sort((a, b) => (a.m ?? 9e9) - (b.m ?? 9e9));
	const nearest = ranked[0];
	function enableGps() {
		if (!navigator.geolocation) {
			pushTurn({
				role: "assistant",
				text: "Brak GPS w tej przeglądarce."
			});
			return;
		}
		navigator.geolocation.getCurrentPosition((p) => setPos({
			lat: p.coords.latitude,
			lng: p.coords.longitude
		}), () => pushTurn({
			role: "assistant",
			text: "Nie mam zgody na lokalizację. Użyj trybu demo."
		}), {
			enableHighAccuracy: true,
			timeout: 8e3
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-0 flex-1 overflow-auto px-4 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-2xl border border-border bg-card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
					children: "Radar"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-display text-2xl tabular-nums text-primary",
					children: !pos ? "brak pozycji" : nearest.m !== null && nearest.m < 1e3 ? `${Math.round(nearest.m)} m do ${nearest.s.name}` : `${((nearest.m ?? 0) / 1e3).toFixed(1)} km do ${nearest.s.name}`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: enableGps,
						children: "Włącz GPS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => {
							setPos({
								lat: 50.2596,
								lng: 19.0216
							});
							setTab("chat");
							pushTurn({
								role: "assistant",
								text: "Stoimy na Rynku. AiOLI jest kilka kroków stąd."
							});
						},
						children: "Tryb demo: Rynek"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 space-y-3",
			children: ranked.map(({ s, m }) => {
				const ag = AGENTS[s.agent];
				const near = m !== null && m < 120;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-2xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg text-primary",
							children: s.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								ag.name,
								" dyżuruje · ",
								s.area,
								m !== null ? ` · ${Math.round(m)} m` : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm",
							children: near ? "Bebok w zasięgu — gadaj i rób zdjęcie." : s.promo
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => {
									const fresh = addStamp(s.id);
									pushTurn({
										role: "assistant",
										text: fresh ? `Pieczątka: ${s.name}.` : `Tu już byłeś: ${s.name}.`
									});
								},
								children: "Check-in"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => setCameraSpot(s.id),
								children: "Zdjęcie"
							})]
						})
					]
				}, s.id);
			})
		})]
	});
}
function StampPanel() {
	const stamps = useGuide((s) => s.stamps);
	const points = useGuide((s) => s.points);
	const left = Math.max(0, 3 - stamps.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-0 flex-1 overflow-auto px-4 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-2xl border border-border bg-card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl text-primary",
					children: "Karta HypEat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "3 pieczątki otwierają kupon demo. Zdjęcie i check-in dają punkty."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm tabular-nums",
					children: ["Punkty ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary",
						children: points
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: SPOTS.slice(0, 8).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("flex size-16 items-center justify-center rounded-lg border text-center text-[10px] leading-tight px-1", stamps.includes(s.id) ? "border-ok bg-muted text-ok" : "border-dashed border-border text-muted-foreground"),
						children: s.name.split(" ")[0]
					}, s.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: left === 0 ? "Kupon demo odblokowany — do wymiany, gdy lokal podpisze regulamin nagród." : `Zbierz jeszcze ${left} pieczątki.`
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-3 rounded-2xl border border-border bg-card p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-lg text-primary",
				children: "Avatar"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Bebok na scenie oddycha, rusza się gdy mówi i gdy słucha. Głos pochodzi z syntezatora w urządzeniu. Mózg czatu — Grok, z lokalnym zapasem."
			})]
		})]
	});
}
function CameraSheet() {
	const cameraSpotId = useGuide((s) => s.cameraSpotId);
	const setCameraSpot = useGuide((s) => s.setCameraSpot);
	const addStamp = useGuide((s) => s.addStamp);
	const pushTurn = useGuide((s) => s.pushTurn);
	const videoRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const spot = SPOTS.find((s) => s.id === cameraSpotId);
	(0, import_react.useEffect)(() => {
		if (!cameraSpotId) return;
		let dead = false;
		navigator.mediaDevices?.getUserMedia({
			video: { facingMode: "environment" },
			audio: false
		}).then((stream) => {
			if (dead) {
				stream.getTracks().forEach((t) => t.stop());
				return;
			}
			streamRef.current = stream;
			if (videoRef.current) videoRef.current.srcObject = stream;
		}).catch(() => {
			pushTurn({
				role: "assistant",
				text: "Kamera potrzebuje zgody. Check-in i tak możesz zrobić z mapy."
			});
		});
		return () => {
			dead = true;
			streamRef.current?.getTracks().forEach((t) => t.stop());
			streamRef.current = null;
		};
	}, [cameraSpotId, pushTurn]);
	if (!spot) return null;
	const ag = AGENTS[spot.agent];
	function close() {
		streamRef.current?.getTracks().forEach((t) => t.stop());
		setCameraSpot(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex flex-col bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: videoRef,
				autoPlay: true,
				playsInline: true,
				className: "min-h-0 flex-1 bg-bg object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: ag.img,
				alt: "",
				className: "pointer-events-none absolute right-3 bottom-24 w-[36vw] max-w-44"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-bg to-transparent p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "flex-1",
					onClick: () => {
						addStamp(spot.id, 5);
						pushTurn({
							role: "assistant",
							text: `Zdjęcie z ${ag.name} przy ${spot.name} zapisane jako check-in.`
						});
						close();
					},
					children: "Zrób zdjęcie"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "flex-1",
					variant: "secondary",
					onClick: close,
					children: "Zamknij"
				})]
			})
		]
	});
}
var TABS = [
	{
		id: "chat",
		label: "Czat",
		Icon: MessageCircle
	},
	{
		id: "mapa",
		label: "Mapa",
		Icon: Map
	},
	{
		id: "hunt",
		label: "Polowanie",
		Icon: Radar
	},
	{
		id: "karta",
		label: "Karta",
		Icon: CreditCard
	}
];
function AppShell() {
	const agentId = useGuide((s) => s.agentId);
	const agent = AGENTS[agentId];
	const tab = useGuide((s) => s.tab);
	const setTab = useGuide((s) => s.setTab);
	const points = useGuide((s) => s.points);
	const resetAgent = useGuide((s) => s.resetAgent);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex h-dvh max-w-lg flex-col bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-3 border-b border-border px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: resetAgent,
						className: "shrink-0",
						"aria-label": "Zmień avatara",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: agent.img,
							alt: "",
							className: "size-10 rounded-full border border-border object-cover object-top"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-medium text-primary",
							children: agent.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: agent.role
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-full border border-border px-3 py-1 text-xs tabular-nums text-primary",
						children: points
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex border-b border-border",
				children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setTab(t.id),
					className: cn("flex min-h-11 flex-1 items-center justify-center gap-1.5 text-xs", tab === t.id ? "text-primary shadow-[inset_0_-2px_0_var(--color-primary)]" : "text-muted-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.Icon, { className: "size-3.5" }), t.label]
				}, t.id))
			}),
			tab === "chat" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatPanel, {}),
			tab === "mapa" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPanel, {}),
			tab === "hunt" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HuntPanel, {}),
			tab === "karta" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StampPanel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraSheet, {})
		]
	});
}
var ORDER = [
	"hopla",
	"podciep",
	"hanys",
	"fachura"
];
function PickScreen() {
	const setAgent = useGuide((s) => s.setAgent);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh max-w-3xl flex-col px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase",
				children: "HypEat · Katowice"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl leading-tight tracking-tight",
				children: "Beboki"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-md text-muted-foreground",
				children: "Wybierz avatara. Będzie mówił, słuchał i prowadził po stołach miasta."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: ORDER.map((id, i) => {
					const a = AGENTS[id];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setAgent(id),
						className: "animate-rise group rounded-2xl border border-border bg-card p-3 text-left transition-transform duration-150 hover:-translate-y-0.5",
						style: { animationDelay: `${i * 60}ms` },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: a.img,
								alt: a.name,
								className: "h-40 w-full rounded-lg object-cover object-top sm:h-44"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								className: "mt-3 block font-display text-lg text-primary",
								children: a.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-xs text-muted-foreground",
								children: a.role
							})
						]
					}, id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-xs text-muted-foreground",
				children: "Baza lokali jest demonstracyjna. Ceny i promocje potwierdza lokal."
			})
		]
	});
}
function Home() {
	const agentId = useGuide((s) => s.agentId);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const done = () => setHydrated(true);
		if (useGuide.persist.hasHydrated()) done();
		return useGuide.persist.onFinishHydration(done);
	}, []);
	if (!hydrated || !agentId) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickScreen, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {});
}
//#endregion
export { Home as component };
