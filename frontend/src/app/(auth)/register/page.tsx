import type { Metadata } from "next";

import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "新規登録",
};

export default function RegisterPage() {
  return (
    <section className="w-full max-w-md rounded-3xl border bg-card p-6 shadow-[0_24px_70px_-38px_rgba(23,50,77,0.5)] sm:p-8">
      <div className="mb-7 text-center">
        <p className="text-sm font-semibold text-teal-700">Start learning</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          新規登録
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          アカウントを作成して、今日の学びを記録しましょう。
        </p>
      </div>
      <RegisterForm />
    </section>
  );
}
