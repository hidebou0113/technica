"use client";

import { ArrowLeft, LoaderCircle } from "lucide-react";
import Link from "next/link";

import { Brand } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";

export default function NotFound() {
  const { data: user, isPending } = useCurrentUser();
  const destination = user ? "/dashboard" : "/";
  const linkLabel = user ? "ダッシュボードへ戻る" : "トップページへ戻る";
  const brandLabel = user ? "Technica ダッシュボード" : "Technica トップページ";

  if (isPending) {
    return (
      <main
        className="flex min-h-svh items-center justify-center"
        role="status"
        aria-label="ログイン状態を確認中"
      >
        <LoaderCircle className="size-7 animate-spin text-teal-600" aria-hidden="true" />
      </main>
    );
  }

  return (
    <main className="flex min-h-svh flex-col bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.10),transparent_32rem)]">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Brand href={destination} ariaLabel={brandLabel} />
      </div>

      <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <p className="font-mono text-sm font-semibold tracking-[0.2em] text-teal-700">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          ページが見つかりません
        </h1>
        <p className="mt-4 max-w-md leading-7 text-muted-foreground">
          お探しのページは移動または削除されたか、URLが間違っている可能性があります。
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href={destination}>
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            {linkLabel}
          </Link>
        </Button>
      </section>
    </main>
  );
}
