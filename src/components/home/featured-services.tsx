import Link from "next/link";
import { getFeaturedServices } from "@/lib/queries/services";
import { ServiceCard } from "@/components/catalog/service-card";

export async function FeaturedServices() {
  const services = await getFeaturedServices(8);
  if (services.length === 0) return null;

  return (
    <section className="bg-cream-100/60 py-16">
      <div className="container">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Популярные услуги</h2>
            <p className="mt-1 text-ink-500">Чаще всего заказывают на этой неделе</p>
          </div>
          <Link href="/services" className="text-sm font-medium text-rust-600 hover:underline">
            Смотреть все →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
