import { ArrowRight, BookOpenCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "ダッシュボード",
};

export default function DashboardPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-teal-700">今日も一歩ずつ進めましょう</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">ダッシュボード</h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          学習状況の集計はIssue #19で実装します。現在は共通レイアウトを確認するための画面です。
        </p>
      </div>

      <Card className="max-w-2xl border-0 shadow-[0_18px_55px_-32px_rgba(23,50,77,0.45)] ring-1 ring-border">
        <CardHeader>
          <span className="mb-3 flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <BookOpenCheck className="size-5" aria-hidden="true" />
          </span>
          <CardTitle className="text-lg">学習を始める準備ができました</CardTitle>
          <CardDescription>
            単語を登録すると、学習状況や復習予定がここに表示されます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg">
            <Link href="/words/create">
              単語登録ページへ
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
