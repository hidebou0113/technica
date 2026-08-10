import { ArrowRight } from "lucide-react";

const steps = [
  { number: "01", title: "登録", description: "覚えたい技術用語を残す" },
  { number: "02", title: "整理", description: "単語帳でテーマ別にまとめる" },
  { number: "03", title: "復習", description: "繰り返し確認して定着させる" },
];

export function LearningFlowSection() {
  return (
    <section aria-labelledby="flow-heading" className="rounded-3xl border bg-card px-6 py-10 sm:px-10 sm:py-12">
      <div className="text-center">
        <p className="text-sm font-semibold text-teal-700">学習フロー</p>
        <h2 id="flow-heading" className="mt-2 text-3xl font-semibold tracking-tight">
          3つのステップで知識を定着
        </h2>
      </div>

      <ol className="mt-10 grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
        {steps.map((step, index) => (
          <li key={step.number} className="contents">
            <div className="rounded-2xl bg-muted px-5 py-6">
              <span className="font-mono text-xs font-semibold text-teal-700">{step.number}</span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="mx-auto hidden size-5 text-muted-foreground md:block" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
