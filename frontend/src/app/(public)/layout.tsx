import { Header } from "@/components/layout/header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-svh bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.10),transparent_32rem)]">
      <Header variant="public" />
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {children}
      </main>
    </div>
  );
}
