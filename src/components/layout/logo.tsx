import Link from "next/link";
import { cn } from "@/lib/utils";

/** Wordmark + a stamped "seal" mark, standing in for the artel's guild seal
 * — deliberately not a generic rounded-square app icon. */
export function Logo({ className }: { className?: string }) {
  return (
    // prefetch=false: under GitHub Pages' basePath, Next requests the home
    // route's RSC payload at "<basePath>.txt" instead of "<basePath>/index.txt",
    // which 404s (harmlessly — Next falls back to a full navigation either way).
    <Link href="/" prefetch={false} className={cn("inline-flex items-center gap-2.5 group", className)}>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden>
        <circle cx="17" cy="17" r="16" stroke="#C1502E" strokeWidth="1.4" strokeDasharray="1.5 4.5" />
        <circle cx="17" cy="17" r="12.5" fill="#C1502E" className="transition-transform group-hover:rotate-6 origin-center" />
        <path
          d="M17 9.5L23 22.5H20.4L19.1 19.6H14.9L13.6 22.5H11L17 9.5ZM17 13.3L15.6 17.3H18.4L17 13.3Z"
          fill="#FAF6EF"
        />
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight text-ink-900">Артель</span>
    </Link>
  );
}
