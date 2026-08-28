import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
      <Link to="/" className="font-display text-2xl tracking-tight">
        hypeat.club
      </Link>
      <img
        src="/beboki/figs/skarbnik.png"
        alt=""
        className="animate-fig mt-8 h-28 w-28 object-contain"
      />
      <h1 className="mt-8 font-display text-4xl leading-tight">Wejście do klubu</h1>
      <p className="mt-3 text-base text-muted-foreground">
        Pamiętnik wizyt, punkty z paragonów, odznaki i to, ile poszło na pieski. Google albo X.
      </p>
      {authEnabled ? (
        <div className="mt-8 space-y-2">
          {GROK_PROVIDERS.map((p) => (
            <Button
              key={p.providerId}
              className="w-full"
              variant={p.idp === "google" ? "default" : "secondary"}
              onClick={() => signIn(p.providerId, { callbackURL: "/ja" })}
            >
              Wejdź z {p.label}
            </Button>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">Logowanie jest wyłączone.</p>
      )}
      <p className="mt-8 text-sm text-muted-foreground">
        Lokal i schronisko zostają osobnymi wejściami — tu tylko gość klubu.
      </p>
    </main>
  );
}
