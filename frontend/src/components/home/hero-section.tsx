import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function HeroSection() {
  return (
    <section className="grid items-center gap-12 pt-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-10">
      <div>
        <p className="mb-5 inline-flex rounded-full border bg-card px-3 py-1 text-xs font-semibold text-teal-700">
          技術学習を、毎日の習慣に
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl lg:leading-[1.12]">
          技術用語を、
          <br />
          覚えたつもりで終わらせない。
        </h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
          Technicaは、学んだ技術用語を記録し、整理し、繰り返し復習するためのシンプルな学習サービスです。
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-11 px-5">
            <Link href="/register">
              無料で始める
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-11 px-5">
            <Link href="/login">ログイン</Link>
          </Button>
        </div>
      </div>

      <Card className="mx-auto w-full max-w-lg border-0 shadow-[0_24px_70px_-40px_rgba(23,50,77,0.5)] ring-1 ring-border">
        <CardHeader className="grid-cols-[1fr_auto] items-center border-b pb-4">
          <div>
            <p className="text-sm font-semibold">今日の復習</p>
            <p className="mt-1 text-xs text-muted-foreground">バックエンド基礎</p>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            3 / 12
          </span>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          <div className="rounded-2xl border bg-background px-6 py-10 text-center sm:py-12">
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Technical term
            </p>
            <p className="mt-4 font-mono text-xl font-semibold text-primary sm:text-2xl">
              dependency injection
            </p>
            <div className="mx-auto my-6 h-px max-w-64 bg-border" />
            <p className="text-base font-medium">依存性の注入</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              必要なオブジェクトを外部から渡す設計手法
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <RotateCcw className="size-3.5" aria-hidden="true" />
              2日ぶりの復習
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-teal-700">
              <CheckCircle2 className="size-3.5" aria-hidden="true" />
              学習中
            </span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
