"use client";

import { Separator } from "@/components/ui/separator";
import { Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

export const FooterSection = () => {
  const { theme } = useTheme();

  return (
    <footer id="footer" className="container py-16 relative">
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="p-10 bg-gradient-to-b from-violet-300 dark:from-violet-950 dark:to-background/60 backdrop-blur-xl border border-secondary/10 rounded-[2rem] shadow-[0_0_1rem_0_rgba(0,0,0,0.1)] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5" />
        <div className="absolute h-px w-full top-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="flex flex-col items-center gap-10 relative">
          <Link 
            href="/" 
            className="group flex items-center transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-700/20 to-violet-800/10 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500" />
              {theme && (
                <Image
                src={"https://res.cloudinary.com/diyxwdtjd/image/upload/v1734098503/projects/aiverse-logo_mbtjg8.png"}
                alt="Logo"
                width={80}
                height={60}
                className="relative mr-3 rounded-full"
              />
              )}

            </div>
            <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
              AiVerse
            </h3>
          </Link>

          <div className="flex gap-10">
            {[
              { icon: Github, href: "https://github.com/debsouryadatta" },
              { icon: Twitter, href: "https://twitter.com/debsourya005" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/debsourya-datta-177909225" }
            ].map((social, index) => (
              <Link 
                key={index}
                href={social.href} 
                target="_blank" 
                className="group relative p-2"
              >
                <div className="absolute inset-0 bg-primary/10 rounded-lg blur-md transition-opacity opacity-0 group-hover:opacity-100" />
                <social.icon className="w-6 h-6 transition-all duration-300 group-hover:text-primary group-hover:scale-110 relative z-10" />
              </Link>
            ))}
          </div>

          <Separator className="w-full bg-gradient-to-r from-transparent via-border to-transparent" />
          
          <p className="text-sm font-medium text-muted-foreground/80 tracking-wide">
            © {new Date().getFullYear()} AiVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
