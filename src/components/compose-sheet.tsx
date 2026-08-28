import { useState } from "react";
import { FOOD_SPOTS } from "@/lib/catalog";
import { UGC_POINTS, type PostKind } from "@/lib/social";
import { createPost } from "@/lib/posts";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { useGuide } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function shrink(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.onloadeddata = () => {
        video.currentTime = Math.min(0.4, video.duration || 0.4);
      };
      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, 720 / Math.max(video.videoWidth || 720, video.videoHeight || 720));
        canvas.width = Math.round((video.videoWidth || 720) * scale);
        canvas.height = Math.round((video.videoHeight || 720) * scale);
        canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", 0.62));
      };
      video.onerror = () => reject(new Error("video"));
      video.src = url;
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, 720 / Math.max(img.width, img.height));
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.62));
      };
      img.onerror = () => reject(new Error("img"));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error("file"));
    reader.readAsDataURL(file);
  });
}

export function ComposeSheet({
  open,
  onClose,
  onPosted,
  spotId,
}: {
  open: boolean;
  onClose: () => void;
  onPosted: () => void;
  spotId?: string;
}) {
  const user = useCurrentUser();
  const addPoints = useGuide((s) => s.addPoints);
  const bumpClub = useGuide((s) => s.bumpClub);
  const [spot, setSpot] = useState(spotId ?? FOOD_SPOTS[0]?.id ?? "aioli");
  const [kind, setKind] = useState<PostKind>("photo");
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;

  async function onFile(file: File | undefined) {
    if (!file) return;
    setKind(file.type.startsWith("video/") ? "video" : "photo");
    setPreview(await shrink(file));
  }

  async function submit() {
    if (!user) {
      setErr("Wejdź do klubu, żeby dostać punkty za relację.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const res = await createPost({
        data: {
          spotId: spot,
          kind: kind === "review" ? "review" : kind,
          caption,
          media: kind === "review" ? undefined : (preview ?? undefined),
          authorName: user.displayName ?? "Członek",
          authorAvatar: user.profileImageUrl,
        },
      });
      if (!res.ok) {
        setErr(
          res.reason === "cap"
            ? "Dzienny limit punktów za relacje."
            : res.reason === "caption"
              ? "Opinia musi mieć kilka zdań."
              : res.reason === "media"
                ? "Dodaj zdjęcie albo kadr z filmu."
                : "Nie udało się dodać wpisu.",
        );
        return;
      }
      addPoints(res.points);
      bumpClub();
      setCaption("");
      setPreview(null);
      onPosted();
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg">
      <div className="flex items-center justify-between px-4 py-3 shadow-card bg-card">
        <p className="font-display text-xl">Nowa relacja</p>
        <Button variant="secondary" onClick={onClose}>
          Zamknij
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-4 py-4">
        <p className="text-base text-muted-foreground">
          Zdjęcie +{UGC_POINTS.photo} pkt · film +{UGC_POINTS.video} · opinia +{UGC_POINTS.review}. Punkty na darmowe posiłki w sieci.
        </p>
        <label className="mt-4 block text-sm text-muted-foreground">Lokal</label>
        <select
          className="mt-1 h-11 w-full rounded-xl border border-border bg-card px-3 text-base"
          value={spot}
          onChange={(e) => setSpot(e.target.value)}
        >
          {FOOD_SPOTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <div className="mt-3 flex gap-2">
          {(["photo", "video", "review"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={`min-h-11 flex-1 rounded-xl text-sm ${kind === k ? "bg-primary text-primary-foreground" : "bg-card shadow-card"}`}
            >
              {k === "photo" ? "Zdjęcie" : k === "video" ? "Film" : "Opinia"}
            </button>
          ))}
        </div>
        {kind !== "review" && (
          <label className="mt-4 flex min-h-24 cursor-pointer items-center justify-center rounded-2xl bg-muted text-base">
            {preview ? "Zmień kadr" : "Zrób zdjęcie albo wgraj film"}
            <input
              type="file"
              accept={kind === "video" ? "video/*,image/*" : "image/*"}
              capture="environment"
              className="hidden"
              onChange={(e) => void onFile(e.target.files?.[0])}
            />
          </label>
        )}
        {preview && (
          <img src={preview} alt="" className="img-frame mt-3 max-h-56 w-full rounded-2xl object-cover" />
        )}
        <label className="mt-4 block text-sm text-muted-foreground">
          {kind === "review" ? "Opinia" : "Podpis"}
        </label>
        <textarea
          className="mt-1 min-h-24 w-full rounded-xl border border-border bg-card px-3 py-2 text-base"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="co zjadłeś, dla kogo, czy wrócisz"
        />
        {err && <p className="mt-3 text-base text-primary">{err}</p>}
        <Button className="mt-4 w-full" disabled={busy} onClick={() => void submit()}>
          {busy ? "Zapisuję…" : `Opublikuj · +${UGC_POINTS[kind]} pkt`}
        </Button>
        <p className="mt-3 text-sm text-muted-foreground">
          Film w klubie zostaje kadrem. Pełny klip wrzuć na Instagram i oznacz lokal — tu rozliczamy cashback.
        </p>
      </div>
    </div>
  );
}
