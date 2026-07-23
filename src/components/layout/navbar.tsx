import Link from "next/link";
import { Suspense } from "react";
import { getCategories } from "@/lib/queries/categories";
import { Logo } from "./logo";
import { CategoryMenu } from "./category-menu";
import { SearchBox } from "./search-box";
import { UserMenu } from "./user-menu";
import { MobileMenu } from "./mobile-menu";

export async function Navbar() {
  const categories = await getCategories();

  return (
    <header className="telegram-hide sticky top-0 z-40 border-b border-ink-100 bg-cream-50/90 backdrop-blur-md">
      <div className="container flex h-[72px] items-center gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          <CategoryMenu categories={categories} />
          <Link href="/freelancers" className="rounded-lg px-3 py-2 text-[0.95rem] font-medium text-ink-700 hover:bg-ink-50 hover:text-ink-900">
            Исполнители
          </Link>
          <Link href="/how-it-works" className="rounded-lg px-3 py-2 text-[0.95rem] font-medium text-ink-700 hover:bg-ink-50 hover:text-ink-900">
            Как это работает
          </Link>
          <Link href="/safety" className="rounded-lg px-3 py-2 text-[0.95rem] font-medium text-ink-700 hover:bg-ink-50 hover:text-ink-900">
            Безопасность
          </Link>
        </nav>

        <div className="hidden max-w-md flex-1 lg:block">
          <Suspense fallback={<div className="h-11 rounded-full bg-ink-50" />}>
            <SearchBox />
          </Suspense>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden lg:block">
            <UserMenu />
          </div>
          <MobileMenu categories={categories} />
        </div>
      </div>
    </header>
  );
}
