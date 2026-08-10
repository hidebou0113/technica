import { BookMarked, BookOpenText, RefreshCw } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "技術用語を記録",
    description: "学習中に出会った用語と意味を、その場でシンプルに記録できます。",
    icon: BookOpenText,
  },
  {
    title: "単語帳で整理",
    description: "テーマごとに単語をまとめて、あとから探しやすく整理できます。",
    icon: BookMarked,
  },
  {
    title: "復習を習慣化",
    description: "登録した用語を繰り返し振り返り、知識として定着させます。",
    icon: RefreshCw,
  },
];

export function FeaturesSection() {
  return (
    <section aria-labelledby="features-heading">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-teal-700">主な機能</p>
        <h2 id="features-heading" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          学びを残し、整理し、身につける
        </h2>
        <p className="mt-4 leading-7 text-muted-foreground">
          技術学習に必要な流れを、迷わず続けられる形にまとめました。
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="gap-3 py-6">
            <CardHeader>
              <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <feature.icon className="size-5" aria-hidden="true" />
              </span>
              <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-7 text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
