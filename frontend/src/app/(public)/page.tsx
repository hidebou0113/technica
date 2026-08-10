import type { Metadata } from "next";
import Link from "next/link";

import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";
import { LearningFlowSection } from "@/components/home/learning-flow-section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "技術用語の記録と復習",
  description:
    "Technicaは、技術用語を記録し、単語帳で整理し、復習を習慣化するための学習サービスです。",
};

export default function HomePage() {
  return (
    <div className="space-y-24 pb-6 sm:space-y-28 lg:space-y-32">
      <HeroSection />
      <FeaturesSection />
      <LearningFlowSection />

      <section className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-10 sm:py-14">
        <p className="text-sm font-semibold text-teal-300">Learn · Review · Grow</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          今日の学びを、明日の知識に。
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
          覚えておきたい技術用語を記録して、自分のペースで復習を始めましょう。
        </p>
        <Button asChild size="lg" className="mt-7 bg-teal-400 text-primary hover:bg-teal-300">
          <Link href="/register">無料で始める</Link>
        </Button>
      </section>
    </div>
  );
}
