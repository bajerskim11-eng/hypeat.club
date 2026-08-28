import { createFileRoute, Link } from "@tanstack/react-router";
import { ClubHeader } from "@/components/club-header";
import { FeedPanel } from "@/components/feed-panel";

export const Route = createFileRoute("/u/$userId")({ component: MemberPage });

function MemberPage() {
  const { userId } = Route.useParams();
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col px-4">
      <ClubHeader compact />
      <p className="text-sm text-muted-foreground">
        <Link to="/tablica" className="text-primary">
          Tablica
        </Link>
        {" · "}profil członka
      </p>
      <FeedPanel userId={userId} />
    </main>
  );
}
