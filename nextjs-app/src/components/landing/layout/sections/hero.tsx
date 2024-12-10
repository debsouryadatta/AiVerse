"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export const HeroSection = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const safeRedirect = (url: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  }

  return (
    <section id="hero" className="container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32">
        <div className="text-center space-y-8">
          <Badge variant="outline" className="text-sm py-2">
            <span className="mr-2 text-primary">
              <Badge>New</Badge>
            </span>
            <span> AI-Powered Learning Platform </span>
          </Badge>

          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
            <h1>
              Welcome to
              <span className="text-transparent px-2 bg-gradient-to-r from-violet-600 via-violet-500 to-primary bg-clip-text">
                AiVerse
              </span>
              
            </h1>
          </div>

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
            {`Unleash the Power of AI in Learning. Join the Community!`}
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button onClick={() => safeRedirect("/explore")} className="w-5/6 md:w-1/4 font-bold group/arrow">
              Get Started
              <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
            </Button>

            <Button
              asChild
              variant="secondary"
              className="w-5/6 md:w-1/4 font-bold cursor-pointer"
              onClick={async() => await signIn("google")}
            >
              <div>
                <IconBrandGoogleFilled className="text-neutral-700 dark:text-neutral-200 h-4 w-4 flex-shrink-0 mr-1" />
                Sign In
              </div>
            </Button>
          </div>
        </div>

        <div className="relative group mt-14">
          <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-violet-500/50 rounded-full blur-3xl"></div>
          <Image
            width={1200}
            height={1200}
            className="w-full md:w-[1200px] mx-auto rounded-lg relative rouded-lg leading-none flex items-center border border-t-2 border-secondary  border-t-primary/30"
            src={
              theme === "light"
                ? "https://res.cloudinary.com/diyxwdtjd/image/upload/v1733776278/projects/Screenshot_2024-12-10_at_2.00.36_AM_cam35k.png"
                : "https://res.cloudinary.com/diyxwdtjd/image/upload/v1733776043/projects/Screenshot_2024-12-10_at_1.56.33_AM_mativv.png"
            }
            alt="dashboard"
          />

          <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"></div>
        </div>
      </div>
    </section>
  );
};
