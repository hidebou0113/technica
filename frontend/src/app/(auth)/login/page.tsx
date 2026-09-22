import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "ログイン",
};

export default function LoginPage() {
  return (
    <section className="w-full max-w-md rounded-3xl border bg-card p-6 shadow-[0_24px_70px_-38px_rgba(23,50,77,0.5)] sm:p-8">
      <div className="mb-7 text-center">
        <p className="text-sm font-semibold text-teal-700">Welcome back</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">ログイン</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          学習の続きを始めましょう。
        </p>
      </div>
      <LoginForm />
    </section>
  );
}
