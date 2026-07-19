import Link from "next/link";
import { getTopFreelancers } from "@/lib/queries/freelancers";
import { FreelancerCard } from "@/components/catalog/freelancer-card";

export async function TopFreelancers() {
  const freelancers = await getTopFreelancers(4);
  if (freelancers.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Мастера с высоким рейтингом</h2>
            <p className="mt-1 text-ink-500">Проверенные исполнители с лучшими отзывами</p>
          </div>
          <Link href="/freelancers" className="text-sm font-medium text-rust-600 hover:underline">
            Все исполнители →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {freelancers.map((f) => (
            <FreelancerCard key={f.id} freelancer={f} />
          ))}
        </div>
      </div>
    </section>
  );
}
