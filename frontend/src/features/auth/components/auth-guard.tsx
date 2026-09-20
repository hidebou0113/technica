"use client";

import { LoaderCircle, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";

type AuthGuardProps = {
  children: ReactNode;
  requireAuthentication: boolean;
};

export function AuthGuard({
  children,
  requireAuthentication,
}: AuthGuardProps) {
  const router = useRouter();
  const { data: user, isPending, isError, refetch } = useCurrentUser();
  const shouldRedirect = requireAuthentication ? user === null : Boolean(user);

  useEffect(() => {
    if (isPending || isError || !shouldRedirect) {
      return;
    }

    router.replace(requireAuthentication ? "/login" : "/dashboard");
  }, [isError, isPending, requireAuthentication, router, shouldRedirect]);

  if (isPending || shouldRedirect) {
    return (
      <div
        className="flex min-h-svh items-center justify-center"
        role="status"
        aria-label="ログイン状態を確認中"
      >
        <LoaderCircle className="size-7 animate-spin text-teal-600" aria-hidden="true" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-svh items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border bg-card p-6 text-center shadow-sm">
          <TriangleAlert className="mx-auto size-8 text-destructive" aria-hidden="true" />
          <p className="mt-4 font-semibold">ログイン状態を確認できませんでした</p>
          <p className="mt-2 text-sm text-muted-foreground">
            通信環境を確認して、もう一度お試しください。
          </p>
          <Button className="mt-5" onClick={() => void refetch()}>
            再試行
          </Button>
        </div>
      </div>
    );
  }

  return children;
}
