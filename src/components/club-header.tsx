import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

export function ClubHeader({ compact = false }: { compact?: boolean }) {
  const { isPending } = useCurrentUserState();

  return (
    <header className={cn("flex items-center justify-between gap-3 py-4", compact && "py-2.5")}>
      <Link to="/" className="font-display text-xl tracking-tight text-foreground sm:text-2xl">
        hypeat.club
      </Link>
      <nav className="flex items-center gap-3 text-sm">
        <Link to="/ja" className="hidden text-muted-foreground hover:text-foreground sm:inline">
          Profil
        </Link>
        <Link to="/tablica" className="hidden text-muted-foreground hover:text-foreground sm:inline">
          Tablica
        </Link>
        <Link to="/lokal" className="hidden text-muted-foreground hover:text-foreground sm:inline">
          Lokal
        </Link>
        <Link to="/schronisko" className="hidden text-muted-foreground hover:text-foreground sm:inline">
          Schronisko
        </Link>
        {isPending ? (
          <div className="h-8 w-24 animate-pulse rounded-full bg-muted" />
        ) : (
          <>
            <SignedOut>
              <Link to="/login" className="font-medium text-primary">
                Wejdź
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </>
        )}
      </nav>
    </header>
  );
}
