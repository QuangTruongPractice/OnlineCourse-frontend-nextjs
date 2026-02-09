import { BenefitsSection } from "@/src/components/about/benefits-section";
import { CTASection } from "@/src/components/about/cta-section";
import { FeaturesSection } from "@/src/components/about/features-section";
import { HeroSection } from "@/src/components/about/hero-section";
import { TestimonialsSection } from "@/src/components/about/testimonials-section";


export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            <HeroSection />
            <FeaturesSection />
            <BenefitsSection />
            <TestimonialsSection />
            <CTASection />
        </div>
    )
}
