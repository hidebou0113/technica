"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const logoutMutation = useLogout();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLogout() {
    setErrorMessage(null);

    try {
      await logoutMutation.mutateAsync();
      router.replace("/login");
    } catch {
      setErrorMessage("ログアウトできませんでした。もう一度お試しください。");
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Button
        type="button"
        variant="ghost"
        className="w-full justify-start text-slate-300 hover:bg-white/7 hover:text-white"
        disabled={logoutMutation.isPending}
        onClick={() => void handleLogout()}
      >
        {logoutMutation.isPending ? (
          <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" />
        ) : (
          <LogOut data-icon="inline-start" aria-hidden="true" />
        )}
        ログアウト
      </Button>
      {errorMessage && (
        <p role="alert" className="px-3 text-xs leading-5 text-red-300">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
