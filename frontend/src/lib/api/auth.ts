"use client";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

function requireBackendUrl(): string {
  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URLが設定されていません");
  }

  return backendUrl;
}

function getCookie(name: string): string | null {
  const prefix = `${name}=`;

  const cookie = document.cookie
    .split("; ")
    .find((value) => value.startsWith(prefix));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.slice(prefix.length));
}

export async function getCsrfCookie(): Promise<void> {
  const response = await fetch(`${requireBackendUrl()}/sanctum/csrf-cookie`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("CSRF Cookieの取得に失敗しました");
  }
}

type LoginInput = {
  email: string;
  password: string;
};

export async function login(input: LoginInput): Promise<void> {
  await getCsrfCookie();

  const csrfToken = getCookie("XSRF-TOKEN");

  if (!csrfToken) {
    throw new Error("CSRFトークンを取得できませんでした");
  }

  const response = await fetch(`${requireBackendUrl()}/api/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": csrfToken,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("ログインに失敗しました");
  }
}
