import { useRef, type PointerEvent, type ReactNode } from "react";

export function PassCard({ children }: { children: ReactNode }) {
  const card = useRef<HTMLDivElement>(null);

  function tilt(e: PointerEvent<HTMLDivElement>) {
    const el = card.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
  }

  function reset() {
    if (card.current) card.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  }

  return (
    <div className="pass-scene">
      <div
        ref={card}
        onPointerMove={tilt}
        onPointerLeave={reset}
        className="pass-card relative overflow-hidden rounded-3xl p-5"
      >
        <span className="pass-sheen" />
        {children}
      </div>
    </div>
  );
}
