"use client";

import { useQuery } from "@tanstack/react-query";
import { getHealth } from "@/lib/api/health";

export default function Home() {
  const { data, error, isPending } = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Laravel API 動作確認</h1>

      {isPending && <p className="mt-4">APIステータスを確認中...</p>}

      {error && <p className="mt-4 text-red-600">エラー: {error.message}</p>}

      {data && <p className="mt-4">APIステータス: {data.status}</p>}
    </main>
  );
}
