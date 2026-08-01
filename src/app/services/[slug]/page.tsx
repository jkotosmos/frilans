import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GeneratedCover } from "@/components/ui/generated-cover";
import { Rating } from "@/components/ui/rating";
import { OrderPanel } from "@/components/catalog/order-panel";
import { SellerCard } from "@/components/catalog/seller-card";
import { ReviewsList } from "@/components/catalog/reviews-list";
import { FavoriteButton } from "@/components/catalog/favorite-button";
import { getServiceBySlug } from "@/lib/queries/service-detail";
import { getCurrentUser } from "@/lib/session";
import { getAllServiceSlugs, isServiceFavorited } from "@/lib/static-data";

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  if (!service) return {};
  return { title: service.title, description: service.description.slice(0, 160) };
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const [service, user] = await Promise.all([getServiceBySlug(params.slug), getCurrentUser()]);
  if (!service) notFound();

  const isOwnService = user?.id === service.seller.id;
  const isFavorited = user ? await isServiceFavorited(user.id, service.id) : false;

  return (
    <>
      <Navbar />
      <main className="container py-8">
        <nav className="mb-5 flex items-center gap-1.5 text-sm text-ink-400">
          <Link href="/services" className="hover:text-ink-600">
            Услуги
          </Link>
          <ChevronRight className="size-3.5" />
          <Link href={`/services?category=${service.category.slug}`} className="hover:text-ink-600">
            {service.category.name}
          </Link>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-display text-3xl font-semibold leading-tight text-ink-900 sm:text-4xl">{service.title}</h1>
              {!isOwnService && <FavoriteButton serviceId={service.id} initialFavorited={isFavorited} />}
            </div>

            <div className="mt-3 flex items-center gap-3">
              {service.ratingCount > 0 ? (
                <Rating value={service.rating} count={service.ratingCount} stars />
              ) : (
                <span className="text-sm text-ink-300">Пока нет отзывов</span>
              )}
              <span className="text-sm text-ink-300">·</span>
              <span className="text-sm text-ink-500">{service.ordersCount} заказов выполнено</span>
            </div>

            <GeneratedCover seed={service.coverSeed} icon={service.category.icon} className="mt-6 rounded-xl2" />

            <div className="mt-8 lg:hidden">
              <OrderPanel packages={service.packages} isOwnService={isOwnService} />
            </div>

            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold text-ink-900">Описание услуги</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-600">{service.description}</p>
            </section>

            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold text-ink-900">
                Отзывы {service.ratingCount > 0 && `(${service.ratingCount})`}
              </h2>
              <div className="mt-4">
                <ReviewsList reviews={service.reviews} />
              </div>
            </section>
          </div>

          <div className="space-y-5">
            <div className="hidden lg:block">
              <OrderPanel packages={service.packages} isOwnService={isOwnService} />
            </div>
            <SellerCard
              seller={{
                ...service.seller,
                servicesCount: service.seller._count.services,
              }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
