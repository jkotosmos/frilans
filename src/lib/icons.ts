import {
  Code2,
  PenTool,
  Smartphone,
  PenLine,
  Megaphone,
  Clapperboard,
  AudioLines,
  LineChart,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

/** Explicit allow-list mapping icon names (stored as data in the DB) to
 * components. Never resolve icons via dynamic import from a DB string. */
export const ICONS: Record<string, LucideIcon> = {
  Code2,
  PenTool,
  Smartphone,
  PenLine,
  Megaphone,
  Clapperboard,
  AudioLines,
  LineChart,
};

export function iconFor(name: string): LucideIcon {
  return ICONS[name] ?? Briefcase;
}
