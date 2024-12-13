import { BenefitsSection } from "@/components/landing/layout/sections/benefits";
import { FAQSection } from "@/components/landing/layout/sections/faq";
import { FeaturesSection } from "@/components/landing/layout/sections/features";
import { FooterSection } from "@/components/landing/layout/sections/footer";
import { HeroSection } from "@/components/landing/layout/sections/hero";
import { PricingSection } from "@/components/landing/layout/sections/pricing";
import { SponsorsSection } from "@/components/landing/layout/sections/sponsors";
import { Navbar } from "@/components/landing/layout/navbar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "AiVerse",
  description: "Unleash the Power of AI in Learning. Join the Community!",
  openGraph: {
    type: "website",
    title: "AiVerse",
    description: "Unleash the Power of AI in Learning. Join the Community!",
    url: "https://aiverse.souryax.tech",
    siteName: "AiVerse",
    images: [{
      url: "https://res.cloudinary.com/diyxwdtjd/image/upload/v1734083939/projects/Screenshot_2024-12-13_at_3.24.58_PM_nsld3o.png",
      width: 1200,
      height: 630,
      alt: "AiVerse Preview Image",
    }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AiVerse",
    description: "Unleash the Power of AI in Learning. Join the Community!",
    site: "https://aiverse.souryax.tech",
    images: [{
      url: "https://res.cloudinary.com/diyxwdtjd/image/upload/v1734083939/projects/Screenshot_2024-12-13_at_3.24.58_PM_nsld3o.png",
      alt: "AiVerse Preview Image",
    }],
  },
};

export default async function Home() {
  const session = await auth();
  if (session?.user?.id) redirect("/explore");

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
