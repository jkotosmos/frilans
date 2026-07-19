import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Clock3, CalendarDays } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Avatar } from "@/components/ui/avatar";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { GeneratedCover } from "@/components/ui/generated-cover";
import { ServiceCard } from "@/components/catalog/service-card";
import { ReviewsList } from "@/components/catalog/reviews-list";
import { MessageButton } from "@/components/catalog/message-button";
import { getFreelancerById } from "@/lib/queries/freelancer-detail";
import { formatDate } from "@/lib/utils";
import { getCurrentUser } from "@/lib/session";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const freelancer = await getFreelancerById(params.id);
  if (!freelancer) return {};
  return { title: freelancer.name };
}

export default async function FreelancerProfilePage({ params }: { params: { id: string } }) {
  const [freelancer, user] = await Promise.all([getFreelancerById(params.id), getCurrentUser()]);
  if (!freelancer) notFound();

  const skills = freelancer.skills?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  const isSelf = user?.id === freelancer.id;

  return (
    <>
      <Navbar />
      <main className="container py-10">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-5">
            <div className="rounded-xl2 border border-ink-100 bg-cream-50 p-6 text-center shadow-card">
              <Avatar seed={freelancer.avatarSeed} name={freelancer.name} size="xl" verified={freelancer.isVerified} className="mx-auto" />
              <h1 className="mt-4 font-display text-xl font-semibold text-ink-900">{freelancer.name}</h1>
              {freelancer.title && <p className="text-sm text-ink-500">{freelancer.title}</p>}

              {freelancer._count.reviewsReceived > 0 && (
                <div className="mt-3 flex justify-center">
                  <Rating value={freelancer.avgRating} count={freelancer._count.reviewsReceived} stars />
                </div>
              )}

              {!isSelf && (
                <div className="mt-5">
                  <MessageButton recipientId={freelancer.id} />
                </div>
              )}

              <dl className="mt-5 space-y-2 text-left text-sm text-ink-500">
                {freelancer.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-ink-300" /> {freelancer.location}
                  </div>
                )}
                {freelancer.responseTime && (
                  <div className="flex items-center gap-2">
                    <Clock3 className="size-4 text-ink-300" /> Отвечает {freelancer.responseTime}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-ink-300" /> На платформе с {formatDate(freelancer.memberSince)}
                </div>
              </dl>

              {skills.length > 0 && (
                <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                  {skills.map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                </div>
              )}
            </div>
          </aside>

          <div className="space-y-10">
            {freelancer.bio && (
              <section>
                <h2 className="font-display text-xl font-semibold text-ink-900">О себе</h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-600">{freelancer.bio}</p>
              </section>
            )}

            {freelancer.portfolioItems.length > 0 && (
              <section>
                <h2 className="font-display text-xl font-semibold text-ink-900">Портфолио</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {freelancer.portfolioItems.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-xl border border-ink-100">
                      <GeneratedCover seed={item.coverSeed} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {freelancer.services.length > 0 && (
              <section>
                <h2 className="font-display text-xl font-semibold text-ink-900">Услуги ({freelancer.services.length})</h2>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {freelancer.services.map((s) => (
                    <ServiceCard key={s.slug} service={s} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-900">
                Отзывы {freelancer._count.reviewsReceived > 0 && `(${freelancer._count.reviewsReceived})`}
              </h2>
              <div className="mt-4">
                <ReviewsList reviews={freelancer.reviewsReceived} />
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
