import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/features/auth/components/login-form";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { RegisterForm } from "@/features/auth/components/register-form";
import {
  useLogin,
  useLogout,
  useRegister,
} from "@/features/auth/hooks/use-auth";
import { AuthApiError } from "@/lib/api/auth";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

vi.mock("@/features/auth/hooks/use-auth", () => ({
  useLogin: vi.fn(),
  useLogout: vi.fn(),
  useRegister: vi.fn(),
}));

describe("LoginForm", () => {
  const mutateAsync = vi.fn();

  beforeEach(() => {
    replace.mockReset();
    mutateAsync.mockReset();
    vi.mocked(useLogin).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useLogin>);
  });

  it("必須項目が未入力の場合_入力エラーを表示すること", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "ログイン" }));

    expect(await screen.findByText("メールアドレスを入力してください")).toBeInTheDocument();
    expect(screen.getByText("パスワードを入力してください")).toBeInTheDocument();
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("入力値が有効な場合_ログインしてダッシュボードへ遷移すること", async () => {
    const user = userEvent.setup();
    mutateAsync.mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "user@example.com",
    });
    render(<LoginForm />);

    await user.type(screen.getByLabelText("メールアドレス"), "user@example.com");
    await user.type(screen.getByLabelText("パスワード"), "password123");
    await user.click(screen.getByRole("button", { name: "ログイン" }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "password123",
      });
      expect(replace).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("APIがバリデーションエラーを返した場合_フォームへエラーを表示すること", async () => {
    const user = userEvent.setup();
    mutateAsync.mockRejectedValue(
      new AuthApiError("入力内容を確認してください。", 422, {
        email: ["メールアドレスまたはパスワードが正しくありません。"],
      }),
    );
    render(<LoginForm />);

    await user.type(screen.getByLabelText("メールアドレス"), "user@example.com");
    await user.type(screen.getByLabelText("パスワード"), "incorrect-password");
    await user.click(screen.getByRole("button", { name: "ログイン" }));

    expect(
      await screen.findByText("メールアドレスまたはパスワードが正しくありません。"),
    ).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});

describe("RegisterForm", () => {
  const mutateAsync = vi.fn();

  beforeEach(() => {
    replace.mockReset();
    mutateAsync.mockReset();
    vi.mocked(useRegister).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useRegister>);
  });

  it("確認用パスワードが一致しない場合_入力エラーを表示すること", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText("名前"), "Test User");
    await user.type(screen.getByLabelText("メールアドレス"), "user@example.com");
    await user.type(screen.getByLabelText("パスワード"), "password123");
    await user.type(screen.getByLabelText("パスワード（確認）"), "different-password");
    await user.click(screen.getByRole("button", { name: "アカウントを作成" }));

    expect(await screen.findByText("パスワードが一致しません")).toBeInTheDocument();
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("入力値が有効な場合_登録してダッシュボードへ遷移すること", async () => {
    const user = userEvent.setup();
    mutateAsync.mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "user@example.com",
    });
    render(<RegisterForm />);

    await user.type(screen.getByLabelText("名前"), "Test User");
    await user.type(screen.getByLabelText("メールアドレス"), "user@example.com");
    await user.type(screen.getByLabelText("パスワード"), "password123");
    await user.type(screen.getByLabelText("パスワード（確認）"), "password123");
    await user.click(screen.getByRole("button", { name: "アカウントを作成" }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        name: "Test User",
        email: "user@example.com",
        password: "password123",
        password_confirmation: "password123",
      });
      expect(replace).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("APIがバリデーションエラーを返した場合_フォームへエラーを表示すること", async () => {
    const user = userEvent.setup();
    mutateAsync.mockRejectedValue(
      new AuthApiError("入力内容を確認してください。", 422, {
        email: ["このメールアドレスは既に使用されています。"],
      }),
    );
    render(<RegisterForm />);

    await user.type(screen.getByLabelText("名前"), "Test User");
    await user.type(screen.getByLabelText("メールアドレス"), "user@example.com");
    await user.type(screen.getByLabelText("パスワード"), "password123");
    await user.type(screen.getByLabelText("パスワード（確認）"), "password123");
    await user.click(screen.getByRole("button", { name: "アカウントを作成" }));

    expect(
      await screen.findByText("このメールアドレスは既に使用されています。"),
    ).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});

describe("LogoutButton", () => {
  const mutateAsync = vi.fn();

  beforeEach(() => {
    replace.mockReset();
    mutateAsync.mockReset();
    vi.mocked(useLogout).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useLogout>);
  });

  it("ログアウトを選択した場合_ログアウトしてログイン画面へ遷移すること", async () => {
    const user = userEvent.setup();
    mutateAsync.mockResolvedValue(undefined);
    render(<LogoutButton />);

    await user.click(screen.getByRole("button", { name: "ログアウト" }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledOnce();
      expect(replace).toHaveBeenCalledWith("/login");
    });
  });
});
