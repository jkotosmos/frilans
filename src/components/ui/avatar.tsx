import { cn, initialsFromName } from "@/lib/utils";
import { duotoneFor } from "@/lib/palette";
import { ShieldCheck } from "lucide-react";

const sizeMap = {
  sm: { box: "size-8", text: "text-xs" },
  md: { box: "size-11", text: "text-sm" },
  lg: { box: "size-16", text: "text-lg" },
  xl: { box: "size-24", text: "text-2xl" },
};

interface AvatarProps {
  seed: string;
  name: string;
  size?: keyof typeof sizeMap;
  verified?: boolean;
  className?: string;
}

export function Avatar({ seed, name, size = "md", verified, className }: AvatarProps) {
  const { from, to } = duotoneFor(seed);
  const { box, text } = sizeMap[size];
  return (
    <span className={cn("relative inline-flex shrink-0", box, className)}>
      <span
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full font-display font-semibold text-cream-50 ring-2 ring-cream-50",
          text
        )}
        style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        {initialsFromName(name)}
      </span>
      {verified && (
        <span className="absolute -bottom-0.5 -right-0.5 flex size-[42%] items-center justify-center rounded-full bg-cream-50 ring-2 ring-cream-50">
          <ShieldCheck className="h-full w-full text-pine-600" strokeWidth={2.5} />
        </span>
      )}
    </span>
  );
}
