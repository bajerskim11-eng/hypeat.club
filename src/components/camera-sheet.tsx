import { useEffect, useRef } from "react";
import { AGENTS, SPOTS } from "@/lib/catalog";
import { useGuide } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function CameraSheet() {
  const cameraSpotId = useGuide((s) => s.cameraSpotId);
  const setCameraSpot = useGuide((s) => s.setCameraSpot);
  const addStamp = useGuide((s) => s.addStamp);
  const pushTurn = useGuide((s) => s.pushTurn);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const spot = SPOTS.find((s) => s.id === cameraSpotId);

  useEffect(() => {
    if (!cameraSpotId) return;
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
      })
      .catch(() => {
        pushTurn({
          role: "assistant",
          text: "Kamera potrzebuje zgody. Check-in i tak możesz zrobić z mapy.",
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

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg">
      <video ref={videoRef} autoPlay playsInline className="min-h-0 flex-1 bg-bg object-cover" />
      <img
        src={ag.img}
        alt=""
        className="pointer-events-none absolute right-3 bottom-24 w-[36vw] max-w-44"
      />
      <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-bg to-transparent p-3">
        <Button
          className="flex-1"
          onClick={() => {
            addStamp(spot.id, 5);
            pushTurn({
              role: "assistant",
              text: `Zdjęcie z ${ag.name} przy ${spot.name} zapisane jako check-in.`,
            });
            close();
          }}
        >
          Zrób zdjęcie
        </Button>
        <Button className="flex-1" variant="secondary" onClick={close}>
          Zamknij
        </Button>
      </div>
    </div>
  );
}
