"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useRegister } from "@/features/auth/hooks/use-auth";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/register-schema";
import { AuthApiError } from "@/lib/api/auth";

const inputClassName =
  "h-11 w-full rounded-xl border bg-background px-3.5 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20";

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await registerMutation.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
        password_confirmation: values.passwordConfirmation,
      });
      router.replace("/dashboard");
    } catch (error) {
      if (error instanceof AuthApiError) {
        const fieldMap = {
          name: "name",
          email: "email",
          password: "password",
          password_confirmation: "passwordConfirmation",
        } as const;
        let hasFieldError = false;

        for (const [apiField, formField] of Object.entries(fieldMap)) {
          const message = error.errors[apiField]?.[0];

          if (message) {
            setError(formField, { type: "server", message });
            hasFieldError = true;
          }
        }

        if (!hasFieldError) {
          setError("root", { type: "server", message: error.message });
        }

        return;
      }

      setError("root", {
        type: "server",
        message: "新規登録に失敗しました。時間をおいてもう一度お試しください。",
      });
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          名前
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={inputClassName}
          {...register("name")}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="register-email" className="text-sm font-medium">
          メールアドレス
        </label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "register-email-error" : undefined}
          className={inputClassName}
          placeholder="you@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p id="register-email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="register-password" className="text-sm font-medium">
          パスワード
        </label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "register-password-error" : undefined}
          className={inputClassName}
          {...register("password")}
        />
        {errors.password ? (
          <p id="register-password-error" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">8文字以上で入力してください。</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password-confirmation" className="text-sm font-medium">
          パスワード（確認）
        </label>
        <input
          id="password-confirmation"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.passwordConfirmation)}
          aria-describedby={
            errors.passwordConfirmation ? "password-confirmation-error" : undefined
          }
          className={inputClassName}
          {...register("passwordConfirmation")}
        />
        {errors.passwordConfirmation && (
          <p id="password-confirmation-error" className="text-sm text-destructive">
            {errors.passwordConfirmation.message}
          </p>
        )}
      </div>

      {errors.root?.message && (
        <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errors.root.message}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending && (
          <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" />
        )}
        アカウントを作成
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        すでにアカウントをお持ちの方は
        <Link
          href="/login"
          className="ml-1 font-semibold text-teal-700 underline-offset-4 hover:underline"
        >
          ログイン
        </Link>
      </p>
    </form>
  );
}
