import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { FOOD_SPOTS } from "@/lib/catalog";
import { parseSpotQr, spotQrValue } from "@/lib/qr";
import { QrImg } from "@/components/qr-img";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  onSpot: (id: string) => void;
};

export function QrSheet({ open, onClose, onSpot }: Props) {
  const onSpotRef = useRef(onSpot);
  onSpotRef.current = onSpot;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cam, setCam] = useState<"off" | "on" | "denied">("off");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let dead = false;
    let raf = 0;

    function tick() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const w = video.videoWidth;
      const h = video.videoHeight;
      if (w && h) {
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const img = ctx.getImageData(0, 0, w, h);
          const code = jsQR(img.data, w, h);
          if (code?.data) {
            const id = parseSpotQr(code.data);
            if (id) {
              onSpotRef.current(id);
              return;
            }
            setErr("To nie jest kod lokalu HypEat.");
          }
        }
      }
      raf = requestAnimationFrame(tick);
    }

    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((stream) => {
        if (dead) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCam("on");
        raf = requestAnimationFrame(tick);
      })
      .catch(() => {
        setCam("denied");
      });

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="font-display text-xl text-foreground">Skanuj kod lokalu</p>
        <Button variant="secondary" onClick={onClose}>
          Zamknij
        </Button>
      </div>
      <video ref={videoRef} autoPlay playsInline muted className="max-h-56 w-full bg-muted object-cover" />
      <canvas ref={canvasRef} className="hidden" />
      <p className="px-4 py-3 text-base text-muted-foreground">
        {cam === "on"
          ? "Nakieruj aparat na kod QR przy kasie."
          : "Kamera niedostępna tutaj. Dotknij kod lokalu poniżej — tak samo jak skan przy stoliku."}
      </p>
      {err && <p className="px-4 text-sm text-primary">{err}</p>}
      <div className="min-h-0 flex-1 overflow-auto px-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {FOOD_SPOTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSpot(s.id)}
              className="surface p-3 text-left"
            >
              <QrImg value={spotQrValue(s.id)} label={`Kod ${s.name}`} className="w-full" />
              <b className="mt-2 block text-sm">{s.name}</b>
              <span className="text-sm text-muted-foreground">{s.area}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
