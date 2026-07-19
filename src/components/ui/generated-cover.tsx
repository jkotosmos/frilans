import { duotoneFor, blobFor } from "@/lib/palette";
import { iconFor } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface GeneratedCoverProps {
  seed: string;
  icon?: string;
  className?: string;
}

/** A designed stand-in for photography: a soft duotone blob plus a guild-seal
 * ring and a centered icon mark. Deterministic per seed so the same service
 * always renders the same cover without storing an image anywhere. */
export function GeneratedCover({ seed, icon, className }: GeneratedCoverProps) {
  const { from, to, tint } = duotoneFor(seed);
  const blob = blobFor(seed);
  const Icon = iconFor(icon ?? "");
  const gradientId = `g-${seed.replace(/[^a-zA-Z0-9]/g, "").slice(0, 24)}`;

  return (
    <div className={cn("relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden", className)} style={{ backgroundColor: tint }}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <g transform="translate(100 100)">
          <path d={blob} fill={`url(#${gradientId})`} opacity={0.9} />
        </g>
        <circle cx="100" cy="100" r="46" fill="none" stroke={to} strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="2 6" />
      </svg>
      <div className="absolute inset-0 bg-grain mix-blend-overlay" aria-hidden />
      <div className="relative flex size-16 items-center justify-center rounded-full bg-cream-50/90 shadow-md backdrop-blur-sm">
        <Icon className="size-7" style={{ color: to }} strokeWidth={1.75} />
      </div>
    </div>
  );
}
