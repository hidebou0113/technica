"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Brand } from "@/components/layout/brand";
import {
  authenticatedNavigation,
  isNavigationItemActive,
} from "@/components/layout/navigation";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-65 flex-col bg-sidebar text-sidebar-foreground lg:flex">
      <div className="px-6 py-6">
        <Brand inverse />
      </div>
      <Separator className="bg-white/10" />

      <nav className="flex-1 px-4 py-6" aria-label="メインナビゲーション">
        <p className="px-3 pb-3 text-xs font-semibold tracking-[0.14em] text-slate-400 uppercase">
          Learning menu
        </p>
        <ul className="space-y-1">
          {authenticatedNavigation.map((item) => {
            const isActive = isNavigationItemActive(pathname, item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/40",
                    isActive
                      ? "bg-sidebar-accent text-white shadow-sm"
                      : "text-slate-300 hover:translate-x-0.5 hover:bg-white/7 hover:text-white",
                  )}
                >
                  <item.icon
                    className={cn("size-5", isActive && "text-teal-300")}
                    aria-hidden="true"
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4">
        <Separator className="mb-4 bg-white/10" />
        <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
          <p className="text-sm font-semibold text-white">今日も一歩ずつ</p>
          <p className="mt-1 text-xs leading-5 text-slate-300">
            短い復習でも、続けることが知識の定着につながります。
          </p>
          <Link
            href="/reviews"
            className="mt-3 inline-flex rounded-md text-xs font-semibold text-teal-300 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/40"
          >
            復習ページを見る
          </Link>
        </div>
      </div>
    </aside>
  );
}
