export type HealthResponse = {
  status: string;
};

export async function getHealth(): Promise<HealthResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URLが設定されていません");
  }

  const response = await fetch(`${baseUrl}/health`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`APIの取得に失敗しました: ${response.status}`);
  }

  return response.json();
}
