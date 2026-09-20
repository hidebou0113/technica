"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useLogin } from "@/features/auth/hooks/use-auth";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login-schema";
import { AuthApiError } from "@/lib/api/auth";

const inputClassName =
  "h-11 w-full rounded-xl border bg-background px-3.5 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20";

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync(values);
      router.replace("/dashboard");
    } catch (error) {
      if (error instanceof AuthApiError) {
        const emailError = error.errors.email?.[0];
        const passwordError = error.errors.password?.[0];

        if (emailError) {
          setError("email", { type: "server", message: emailError });
        }

        if (passwordError) {
          setError("password", { type: "server", message: passwordError });
        }

        if (!emailError && !passwordError) {
          setError("root", { type: "server", message: error.message });
        }

        return;
      }

      setError("root", {
        type: "server",
        message: "ログインに失敗しました。時間をおいてもう一度お試しください。",
      });
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          メールアドレス
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={inputClassName}
          placeholder="you@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          パスワード
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
          className={inputClassName}
          {...register("password")}
        />
        {errors.password && (
          <p id="password-error" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {errors.root?.message && (
        <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errors.root.message}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={loginMutation.isPending}>
        {loginMutation.isPending && (
          <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" />
        )}
        ログイン
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        アカウントをお持ちでない方は
        <Link
          href="/register"
          className="ml-1 font-semibold text-teal-700 underline-offset-4 hover:underline"
        >
          新規登録
        </Link>
      </p>
    </form>
  );
}
