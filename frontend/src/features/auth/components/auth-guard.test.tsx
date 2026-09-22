import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

vi.mock("@/features/auth/hooks/use-auth", () => ({
  useCurrentUser: vi.fn(),
}));

describe("AuthGuard", () => {
  beforeEach(() => {
    replace.mockReset();
  });

  it("認証必須画面へ未認証でアクセスした場合_ログイン画面へ遷移すること", async () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: null,
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useCurrentUser>);

    render(
      <AuthGuard requireAuthentication>
        <p>認証後コンテンツ</p>
      </AuthGuard>,
    );

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/login"));
    expect(screen.queryByText("認証後コンテンツ")).not.toBeInTheDocument();
  });

  it("ログイン画面へ認証済みでアクセスした場合_ダッシュボードへ遷移すること", async () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: { id: 1, name: "Test User", email: "user@example.com" },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useCurrentUser>);

    render(
      <AuthGuard requireAuthentication={false}>
        <p>ログインフォーム</p>
      </AuthGuard>,
    );

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/dashboard"));
    expect(screen.queryByText("ログインフォーム")).not.toBeInTheDocument();
  });

  it("認証必須画面へ認証済みでアクセスした場合_コンテンツを表示すること", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: { id: 1, name: "Test User", email: "user@example.com" },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useCurrentUser>);

    render(
      <AuthGuard requireAuthentication>
        <p>認証後コンテンツ</p>
      </AuthGuard>,
    );

    expect(screen.getByText("認証後コンテンツ")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("認証状態の取得に失敗した場合_再試行できること", async () => {
    const user = userEvent.setup();
    const refetch = vi.fn();
    vi.mocked(useCurrentUser).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      refetch,
    } as unknown as ReturnType<typeof useCurrentUser>);

    render(
      <AuthGuard requireAuthentication>
        <p>認証後コンテンツ</p>
      </AuthGuard>,
    );

    await user.click(screen.getByRole("button", { name: "再試行" }));

    expect(refetch).toHaveBeenCalledOnce();
    expect(replace).not.toHaveBeenCalled();
  });
});
