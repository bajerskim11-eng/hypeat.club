import { createFileRoute } from "@tanstack/react-router";
import { DonateWidget } from "@/components/donate-widget";

export const Route = createFileRoute("/wtyczka")({
  validateSearch: (raw: Record<string, unknown>) => ({
    spot: typeof raw.spot === "string" ? raw.spot : "aioli",
  }),
  component: WidgetRoute,
});

function WidgetRoute() {
  const { spot } = Route.useSearch();
  return <DonateWidget spotId={spot} />;
}
