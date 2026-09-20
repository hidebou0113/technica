import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard requireAuthentication>
      <div className="min-h-svh bg-background">
        <Sidebar />
        <div className="lg:pl-65">
          <Header variant="authenticated" />
          <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
