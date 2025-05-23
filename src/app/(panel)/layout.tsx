import type { ReactNode } from "react";
import PanelLayoutClient from "@/components/panel-layout-client";

export default function PanelLayout({ children }: { children: ReactNode }) {
  return <PanelLayoutClient>{children}</PanelLayoutClient>;
}
