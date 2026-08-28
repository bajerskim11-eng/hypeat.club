import { createFileRoute } from "@tanstack/react-router";
import { VenuePanel } from "@/components/venue-panel";

export const Route = createFileRoute("/lokal")({ component: VenuePanel });
