import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;