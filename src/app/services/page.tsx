import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SearchBox } from "@/components/layout/search-box";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { getCategories } from "@/lib/queries/categories";

export const metadata: Metadata = { title: "Каталог услуг" };

export default async function ServicesPage() {
  const categories = await getCategories();

  return (
    <>
      <Navbar />
      <main className="container py-10">
        {/* Navbar carries this on desktop; repeated here for narrow viewports
            and for the Telegram Mini App, where the navbar is hidden entirely
            and this is the only way to search. */}
        <Suspense fallback={<div className="mb-6 h-11 rounded-full bg-ink-100 lg:hidden" />}>
          <SearchBox className="mb-6 lg:hidden" />
        </Suspense>

        <Suspense fallback={<div className="h-96 animate-pulse rounded-xl2 bg-ink-50" />}>
          <CatalogBrowser categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
