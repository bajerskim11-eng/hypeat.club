import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useGuide } from "@/lib/store";
import { ChatPanel } from "@/components/chat-panel";
import { MapPanel } from "@/components/map-panel";
import { HuntPanel } from "@/components/hunt-panel";
import { StampPanel } from "@/components/stamp-panel";
import { ArPanel } from "@/components/ar-panel";
import { FeedPanel } from "@/components/feed-panel";
import { CameraSheet } from "@/components/camera-sheet";

type Tab = "feed" | "chat" | "mapa" | "hunt" | "ar" | "karta";

const STICKY: Tab[] = ["feed", "chat", "mapa", "karta"];

function Pane({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(
        "tab-pane absolute inset-0 flex flex-col bg-bg",
        active ? "tab-pane-on z-10" : "tab-pane-off z-0",
      )}
      aria-hidden={!active}
      inert={!active}
    >
      {children}
    </div>
  );
}

export function TabStage() {
  const tab = useGuide((s) => s.tab);
  const seen = useRef(new Set<Tab>(STICKY));
  seen.current.add(tab);

  return (
    <div className="relative isolate min-h-0 flex-1 overflow-hidden">
      {seen.current.has("feed") && (
        <Pane active={tab === "feed"}>
          <FeedPanel />
        </Pane>
      )}
      {seen.current.has("chat") && (
        <Pane active={tab === "chat"}>
          <ChatPanel />
        </Pane>
      )}
      {seen.current.has("mapa") && (
        <Pane active={tab === "mapa"}>
          <MapPanel />
        </Pane>
      )}
      {seen.current.has("hunt") && (
        <Pane active={tab === "hunt"}>
          <HuntPanel />
        </Pane>
      )}
      {tab === "ar" && (
        <Pane active>
          <ArPanel />
        </Pane>
      )}
      {seen.current.has("karta") && (
        <Pane active={tab === "karta"}>
          <StampPanel />
        </Pane>
      )}
      <CameraSheet />
    </div>
  );
}
