import { createFileRoute } from "@tanstack/react-router";
import { ClubHeader } from "@/components/club-header";
import { FeedPanel } from "@/components/feed-panel";

export const Route = createFileRoute("/tablica")({ component: TablicaPage });

function TablicaPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col px-4">
      <ClubHeader compact />
      <FeedPanel />
    </main>
  );
}
