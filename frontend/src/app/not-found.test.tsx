import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import NotFound from "@/app/not-found";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";

vi.mock("@/features/auth/hooks/use-auth", () => ({
  useCurrentUser: vi.fn(),
}));

describe("NotFound", () => {
  beforeEach(() => {
    vi.mocked(useCurrentUser).mockReset();
  });

  it("未認証の場合_公開トップページへのリンクを表示すること", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: null,
      isPending: false,
    } as unknown as ReturnType<typeof useCurrentUser>);

    render(<NotFound />);

    expect(screen.getByRole("link", { name: "トップページへ戻る" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Technica トップページ" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("認証済みの場合_ダッシュボードへのリンクを表示すること", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: { id: 1, name: "Test User", email: "user@example.com" },
      isPending: false,
    } as unknown as ReturnType<typeof useCurrentUser>);

    render(<NotFound />);

    expect(screen.getByRole("link", { name: "ダッシュボードへ戻る" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
    expect(screen.getByRole("link", { name: "Technica ダッシュボード" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
  });

  it("認証状態を確認中の場合_戻るボタンを無効にすること", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: undefined,
      isPending: true,
    } as unknown as ReturnType<typeof useCurrentUser>);

    render(<NotFound />);

    expect(screen.getByRole("status", { name: "ログイン状態を確認中" })).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
