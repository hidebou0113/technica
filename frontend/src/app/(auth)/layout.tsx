import { Brand } from "@/components/layout/brand";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard requireAuthentication={false}>
      <div className="flex min-h-svh flex-col bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.14),transparent_30rem)]">
        <header className="px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <Brand />
          </div>
        </header>
        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
