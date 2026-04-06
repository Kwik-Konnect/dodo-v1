import { HeroSection } from "@/components/home/hero-section";
import { StoriesSection } from "@/components/home/stories-section";
import { NoticeBanner } from "@/components/home/notice-banner";
import { FeaturedSection } from "@/components/home/featured-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { CTASection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StoriesSection />
      <NoticeBanner />
      <FeaturedSection />
      <HowItWorksSection />
      <CTASection />
    </>
  );
}
