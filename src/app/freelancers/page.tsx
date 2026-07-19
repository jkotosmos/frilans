import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FreelancerCard } from "@/components/catalog/freelancer-card";
import { getAllFreelancers } from "@/lib/queries/freelancers";

export const metadata: Metadata = { title: "Исполнители" };

export default async function FreelancersPage() {
  const freelancers = await getAllFreelancers();

  return (
    <>
      <Navbar />
      <main className="container py-10">
        <h1 className="font-display text-3xl font-semibold text-ink-900">Исполнители</h1>
        <p className="mt-1 text-ink-500">{freelancers.length} проверенных мастеров на платформе</p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {freelancers.map((f) => (
            <FreelancerCard key={f.id} freelancer={f} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
