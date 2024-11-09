import Footer from "@/components/common/Footer";
import { CardSection } from "@/components/landing/CardSection";
import Hero from "@/components/landing/Hero";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();
  if (session?.user?.id) redirect("/gallery");

  return (
    <div className="bg-black">
      <Hero />
      <div className="mt-20 pb-20">
        <h2 className="text-center mt-20 text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Features
        </h2>
        <CardSection />
      </div>
      <Footer />
    </div>
  );
}

export const dynamic = "force-dynamic";
