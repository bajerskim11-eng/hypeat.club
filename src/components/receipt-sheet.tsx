import { useEffect, useRef, useState } from "react";
import { FOOD_SPOTS } from "@/lib/catalog";
import { CASHBACK_RATE, DOG_RATE, dogById, SPONSOR } from "@/lib/loyalty";
import { readReceipt } from "@/lib/read-receipt";
import { addVisit } from "@/lib/visits";
import { useGuide } from "@/lib/store";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DEMO_AMOUNT = 87.4;
const DEMO_SPOT = "aioli";

type Props = {
  open: boolean;
  onClose: () => void;
};

function shrinkDataUrl(src: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 900 / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(src);
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

export function ReceiptSheet({ open, onClose }: Props) {
  const cardSpotId = useGuide((s) => s.cardSpotId);
  const setCardSpot = useGuide((s) => s.setCardSpot);
  const payBill = useGuide((s) => s.payBill);
  const bumpClub = useGuide((s) => s.bumpClub);
  const pushTurn = useGuide((s) => s.pushTurn);
  const user = useCurrentUser();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [bill, setBill] = useState("");
  const [entry, setEntry] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [cam, setCam] = useState(false);

  useEffect(() => {
    if (!open) return;
    let dead = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((stream) => {
        if (dead) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCam(true);
      })
      .catch(() => setCam(false));
    return () => {
      dead = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCam(false);
    };
  }, [open]);

  if (!open) return null;

  const spot = FOOD_SPOTS.find((s) => s.id === cardSpotId);
  const amount = Number(bill.replace(",", "."));
  const pts = Number.isFinite(amount) && amount > 0 ? Math.round(amount * CASHBACK_RATE) : 0;
  const dogPln = Number.isFinite(amount) && amount > 0 ? Math.round(amount * DOG_RATE * 100) / 100 : 0;
  const dog = cardSpotId ? dogById(SPONSOR[cardSpotId] ?? "") : undefined;

  async function ingest(dataUrl: string, demo = false) {
    setPreview(dataUrl);
    setBusy(true);
    setNote(null);
    try {
      if (demo) {
        setCardSpot(DEMO_SPOT);
        setBill(String(DEMO_AMOUNT).replace(".", ","));
        setNote("Odczyt z przykładowego paragonu. Sprawdź kwotę i zatwierdź.");
        return;
      }
      const compact = await shrinkDataUrl(dataUrl);
      const res = await readReceipt({ data: { image: compact, hintSpotId: cardSpotId } });
      if (res.spotId) setCardSpot(res.spotId);
      if (res.amount) {
        setBill(String(res.amount).replace(".", ","));
        setNote("Kwota z paragonu. Popraw, jeśli kasa ma inaczej.");
      } else {
        setNote("Nie odczytałem sumy. Wpisz kwotę z dołu paragonu.");
      }
    } catch {
      setNote("Nie odczytałem sumy. Wpisz kwotę ręcznie.");
    } finally {
      setBusy(false);
    }
  }

  function capture() {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    void ingest(canvas.toDataURL("image/jpeg", 0.8));
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") void ingest(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function confirm() {
    if (!cardSpotId) {
      setNote("Najpierw zeskanuj kod lokalu albo wczytaj paragon demo.");
      return;
    }
    const res = payBill(cardSpotId, amount);
    if (!res) {
      setNote("Wpisz kwotę z paragonu.");
      return;
    }
    const place = FOOD_SPOTS.find((s) => s.id === cardSpotId);
    const d = res.dogId ? dogById(res.dogId) : undefined;
    if (user) {
      try {
        await addVisit({ data: { spotId: cardSpotId, amount, note: entry } });
        bumpClub();
      } catch {
        setNote("Paragon policzony lokalnie. Zaloguj się, żeby wpisać do pamiętnika.");
      }
    }
    pushTurn({
      role: "assistant",
      text: `Paragon ${amount} zł w ${place?.name}. +${res.points} pkt (10%). ${d ? `${d.name}: ${res.dogPln.toFixed(2)} zł z obrotu.` : ""} ${user ? "Wpis w pamiętniku." : "Zaloguj się, żeby dostać odznakę."}`,
    });
    setCardSpot(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="font-display text-xl text-foreground">Paragon</p>
        <Button variant="secondary" onClick={onClose}>
          Zamknij
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-4 py-4">
        <p className="text-base text-muted-foreground">
          {spot ? `Lokal: ${spot.name}` : "Zrób zdjęcie paragonu albo wczytaj przykładowy."}
        </p>
        {preview ? (
          <img src={preview} alt="Paragon" className="mt-3 max-h-64 w-full rounded-lg border border-border object-contain bg-card" />
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="mt-3 max-h-56 w-full rounded-lg bg-muted object-cover" />
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {cam && !preview && (
            <Button onClick={capture}>Zrób zdjęcie</Button>
          )}
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            Wgraj zdjęcie
          </Button>
          <Button
            variant="secondary"
            onClick={() => void ingest("/beboki/receipt-demo.jpg", true)}
          >
            Przykładowy paragon
          </Button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        {busy && <p className="mt-3 text-base text-primary">Czytam kwotę z paragonu…</p>}
        {note && <p className="mt-3 text-base">{note}</p>}
        <label className="mt-4 block text-sm text-muted-foreground">Kwota z paragonu (zł)</label>
        <Input
          className="mt-1"
          inputMode="decimal"
          value={bill}
          onChange={(e) => setBill(e.target.value)}
          aria-label="Kwota z paragonu"
        />
        <label className="mt-4 block text-sm text-muted-foreground">Wpis do pamiętnika</label>
        <Input
          className="mt-1"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="co zjadłeś, z kim, jaki klimat"
          aria-label="Wpis do pamiętnika"
        />
        <p className="mt-2 text-base tabular-nums">
          Zwrot {pts} pkt · {dogPln.toFixed(2)} zł dla {dog?.name ?? "pieska lokalu"}
        </p>
        <Button className="mt-4 w-full" onClick={confirm} disabled={busy}>
          Zaksięguj 10%
        </Button>
      </div>
    </div>
  );
}
