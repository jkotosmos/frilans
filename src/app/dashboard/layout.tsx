import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { UserMenu } from "@/components/layout/user-menu";
import { Logo } from "@/components/layout/logo";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  // Defense in depth: middleware already guards /dashboard, but every layout
  // that reads session-scoped data re-checks it locally too.
  if (!user) redirect("/login?callbackUrl=/dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-cream-100 lg:flex-row">
      <DashboardSidebar role={user.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-ink-100 bg-cream-50 px-5 lg:justify-end">
          <div className="lg:hidden">
            <Logo />
          </div>
          <UserMenu />
        </header>
        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
