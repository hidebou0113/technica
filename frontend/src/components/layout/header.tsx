"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Brand } from "@/components/layout/brand";
import {
  authenticatedNavigation,
  isNavigationItemActive,
} from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type HeaderProps = {
  variant: "public" | "authenticated";
};

export function Header({ variant }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (variant === "authenticated") {
    return (
      <header className="sticky top-0 z-40 border-b bg-background/92 backdrop-blur-xl lg:hidden">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <Brand />

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon-lg" aria-label="メニューを開く">
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[min(20rem,88vw)] border-0 bg-sidebar p-0 text-sidebar-foreground"
            >
              <SheetHeader className="border-b border-white/10 px-5 py-5 text-left">
                <Brand inverse />
                <SheetTitle className="sr-only">学習メニュー</SheetTitle>
                <SheetDescription className="sr-only">
                  Technicaの各学習ページへ移動できます。
                </SheetDescription>
              </SheetHeader>

              <nav className="flex-1 px-3 py-5" aria-label="メインナビゲーション">
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
                          onClick={() => setIsMenuOpen(false)}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/40",
                            isActive
                              ? "bg-sidebar-accent text-white"
                              : "text-slate-300 hover:bg-white/7 hover:text-white",
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

              <div className="p-4 pt-0">
                <Separator className="mb-4 bg-white/10" />
                <p className="rounded-xl bg-white/6 px-4 py-3 text-sm leading-6 text-slate-300">
                  小さな学びを積み重ねて、昨日より一歩先へ。
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Brand />
        <nav className="flex items-center gap-2" aria-label="公開ページナビゲーション">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/login">ログイン</Link>
          </Button>
          <Button asChild>
            <Link href="/register">無料で始める</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
