import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedServices } from "@/components/home/featured-services";
import { HowItWorks } from "@/components/home/how-it-works";
import { TopFreelancers } from "@/components/home/top-freelancers";
import { TrustSection } from "@/components/home/trust-section";
import { CtaSection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CategoryGrid />
        <FeaturedServices />
        <HowItWorks />
        <TopFreelancers />
        <TrustSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
