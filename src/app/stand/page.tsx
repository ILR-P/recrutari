import type { Metadata } from "next";
import { StandPanel } from "@/components/stand/StandPanel";

export const metadata: Metadata = {
  title: "Panoul standului",
  robots: { index: false, follow: false },
};

export default function StandPage() {
  return <StandPanel />;
}
