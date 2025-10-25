"use client";

import { BenefitsSection } from "@/components/landing/layout/sections/benefits";
import { FAQSection } from "@/components/landing/layout/sections/faq";
import { FeaturesSection } from "@/components/landing/layout/sections/features";
import { FooterSection } from "@/components/landing/layout/sections/footer";
import { HeroSection } from "@/components/landing/layout/sections/hero";
import { PricingSection } from "@/components/landing/layout/sections/pricing";
import { SponsorsSection } from "@/components/landing/layout/sections/sponsors";
import { Navbar } from "@/components/landing/layout/navbar";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const session = useSession();

  useEffect(() => {
    if (session?.data?.user) {
      window.location.href = "/explore";
    }
  }, [session])
  

  return (
    <>
      <Navbar />
      <HeroSection />
      <SponsorsSection />
      <BenefitsSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <FooterSection />
    </>
  );
}
