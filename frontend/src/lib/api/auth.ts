"use client";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = LoginInput & {
  name: string;
  password_confirmation: string;
};

type UserResponse = {
  data: AuthUser;
};

type ErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export class AuthApiError extends Error {
  readonly status: number;
  readonly errors: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.errors = errors;
  }
}

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

async function createApiError(
  response: Response,
  fallbackMessage: string,
): Promise<AuthApiError> {
  let errorResponse: ErrorResponse = {};

  try {
    errorResponse = (await response.json()) as ErrorResponse;
  } catch {
    // JSONではないエラーレスポンスでは、画面向けの既定メッセージを使用する。
  }

  return new AuthApiError(
    errorResponse.message ?? fallbackMessage,
    response.status,
    errorResponse.errors,
  );
}

export async function getCsrfCookie(): Promise<void> {
  const response = await fetch(`${requireBackendUrl()}/sanctum/csrf-cookie`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw await createApiError(response, "CSRF Cookieの取得に失敗しました");
  }
}

async function postWithCsrf<T>(
  path: string,
  body?: Record<string, string>,
): Promise<T> {
  await getCsrfCookie();

  const csrfToken = getCookie("XSRF-TOKEN");

  if (!csrfToken) {
    throw new Error("CSRFトークンを取得できませんでした");
  }

  const response = await fetch(`${requireBackendUrl()}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": csrfToken,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw await createApiError(response, "認証処理に失敗しました");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch(`${requireBackendUrl()}/api/v1/user`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw await createApiError(response, "ログイン状態の確認に失敗しました");
  }

  const userResponse = (await response.json()) as UserResponse;

  return userResponse.data;
}

export async function login(input: LoginInput): Promise<AuthUser> {
  const response = await postWithCsrf<UserResponse>("/api/login", input);

  return response.data;
}

export async function register(input: RegisterInput): Promise<AuthUser> {
  const response = await postWithCsrf<UserResponse>("/api/register", input);

  return response.data;
}

export async function logout(): Promise<void> {
  await postWithCsrf<void>("/api/logout");
}
