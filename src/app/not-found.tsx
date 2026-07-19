import Link from "next/link";
import { Compass } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="container flex flex-col items-center justify-center py-28 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-rust-50 text-rust-500">
          <Compass className="size-7" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold text-ink-900">Страница потерялась в мастерской</h1>
        <p className="mt-2 max-w-md text-ink-500">
          Такой страницы не существует или она была перемещена. Загляните в каталог — там точно есть, чем заняться.
        </p>
        <Link href="/services" className="mt-6">
          <Button>Перейти в каталог</Button>
        </Link>
      </main>
      <Footer />
    </>
  );
}
