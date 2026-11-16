import { Hero } from "@/components/home/Hero";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedProducts, Showcase } from "@/components/home/Showcase";
import { Assistance } from "@/components/home/Assistance";
import { DiagnosticWizard } from "@/components/home/DiagnosticWizard";
import { Trust } from "@/components/home/Trust";
import { InstagramSection } from "@/components/home/InstagramSection";
import { ContactSection } from "@/components/home/ContactSection";
import { Marquee } from "@/components/home/Marquee";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <CategorySection />
      <Showcase />
      <Assistance />
      <DiagnosticWizard />
      <FeaturedProducts />
      <Trust />
      <InstagramSection />
      <ContactSection />
    </>
  );
}
