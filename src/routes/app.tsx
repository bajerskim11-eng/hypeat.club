import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PickScreen } from "@/components/pick-screen";
import { useGuide } from "@/lib/store";

export const Route = createFileRoute("/app")({ component: AppPage });

function AppPage() {
  const agentId = useGuide((s) => s.agentId);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const done = () => setHydrated(true);
    if (useGuide.persist.hasHydrated()) done();
    return useGuide.persist.onFinishHydration(done);
  }, []);

  if (!hydrated) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-lg items-center justify-center">
        <p className="font-display text-2xl">Beboki</p>
      </main>
    );
  }
  if (!agentId) return <PickScreen />;
  return <AppShell />;
}

