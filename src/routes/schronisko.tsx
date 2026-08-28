import { createFileRoute } from "@tanstack/react-router";
import { ShelterPanel } from "@/components/shelter-panel";

export const Route = createFileRoute("/schronisko")({ component: ShelterPanel });
