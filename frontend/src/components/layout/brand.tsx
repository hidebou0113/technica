import { BookOpenCheck } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandProps = {
  inverse?: boolean;
  href?: string;
  ariaLabel?: string;
};

export function Brand({
  inverse = false,
  href = "/",
  ariaLabel = "Technica トップページ",
}: BrandProps) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      aria-label={ariaLabel}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-teal-400 text-[#102033] shadow-sm transition-transform group-hover:-rotate-3 group-hover:scale-105">
        <BookOpenCheck className="size-5" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-lg font-semibold tracking-tight",
            inverse ? "text-white" : "text-primary",
          )}
        >
          Technica
        </span>
        <span
          className={cn(
            "mt-1 text-[10px] font-medium tracking-[0.12em] uppercase",
            inverse ? "text-slate-300" : "text-muted-foreground",
          )}
        >
          Learn · Review · Grow
        </span>
      </span>
    </Link>
  );
}
