import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="relative overflow-hidden rounded-xl2 bg-rust-500 px-8 py-14 text-center text-cream-50 sm:px-16">
          <div className="pointer-events-none absolute inset-0 bg-grain opacity-40" aria-hidden />
          <h2 className="relative font-display text-3xl font-semibold sm:text-4xl">Готовы предложить свои услуги?</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-rust-50/90">
            Создайте профиль исполнителя, опубликуйте первую услугу и получайте заказы уже сегодня.
          </p>
          <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register?role=FREELANCER">
              <Button variant="secondary" size="lg" className="bg-ink-950 hover:bg-ink-900">
                Стать исполнителем <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" size="lg" className="border-cream-50/40 text-cream-50 hover:bg-cream-50/10">
                Как это устроено
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
