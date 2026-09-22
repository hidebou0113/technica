import { beforeEach, describe, expect, it, vi } from "vitest";

const backendUrl = "http://localhost:8000";

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

describe("auth API", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_BACKEND_URL", backendUrl);
    vi.stubGlobal("fetch", vi.fn());
    document.cookie = "XSRF-TOKEN=; Max-Age=0; path=/";
  });

  it("getCurrentUser_ログイン中の場合_credentials付きでユーザーを取得できること", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        data: { id: 1, name: "Test User", email: "user@example.com" },
      }),
    );
    const { getCurrentUser } = await import("@/lib/api/auth");

    await expect(getCurrentUser()).resolves.toEqual({
      id: 1,
      name: "Test User",
      email: "user@example.com",
    });
    expect(fetchMock).toHaveBeenCalledWith(`${backendUrl}/api/v1/user`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
  });

  it("getCurrentUser_未認証の場合_nullを返すこと", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 401 }));
    const { getCurrentUser } = await import("@/lib/api/auth");

    await expect(getCurrentUser()).resolves.toBeNull();
  });

  it("login_入力値が有効な場合_CSRF取得後にcredentials付きでログインできること", async () => {
    document.cookie = "XSRF-TOKEN=csrf%20token; path=/";
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(
        jsonResponse({
          data: { id: 1, name: "Test User", email: "user@example.com" },
        }),
      );
    const { login } = await import("@/lib/api/auth");

    await expect(
      login({ email: "user@example.com", password: "password123" }),
    ).resolves.toMatchObject({ id: 1, email: "user@example.com" });
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      `${backendUrl}/sanctum/csrf-cookie`,
      { credentials: "include" },
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `${backendUrl}/api/login`,
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        headers: expect.objectContaining({ "X-XSRF-TOKEN": "csrf token" }),
      }),
    );
  });

  it("register_APIが422を返した場合_フィールドエラーを保持すること", async () => {
    document.cookie = "XSRF-TOKEN=csrf-token; path=/";
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(
        jsonResponse(
          {
            message: "入力内容を確認してください。",
            errors: { email: ["このメールアドレスは既に使用されています。"] },
          },
          { status: 422 },
        ),
      );
    const { AuthApiError, register } = await import("@/lib/api/auth");

    const error = await register({
      name: "Test User",
      email: "user@example.com",
      password: "password123",
      password_confirmation: "password123",
    }).catch((caughtError: unknown) => caughtError);

    expect(error).toBeInstanceOf(AuthApiError);
    expect(error).toMatchObject({
      status: 422,
      errors: { email: ["このメールアドレスは既に使用されています。"] },
    });
  });

  it("logout_ログイン中の場合_CSRF取得後にcredentials付きでログアウトできること", async () => {
    document.cookie = "XSRF-TOKEN=csrf-token; path=/";
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    const { logout } = await import("@/lib/api/auth");

    await expect(logout()).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `${backendUrl}/api/logout`,
      expect.objectContaining({ method: "POST", credentials: "include" }),
    );
  });
});
