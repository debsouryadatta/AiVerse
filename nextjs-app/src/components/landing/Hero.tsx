import React from "react";
import { Spotlight } from "@/components/ui/Spotlight";
import { ButtonsCard } from "../ui/tailwindcss-buttons";
import { FlipWords } from "../ui/flip-words";
import { redirect } from 'next/navigation'
import Link from "next/link";
import BorderMagicButton from "./BorderMagicButton";

export default function Hero() {
    const words = [
        "Unveil The Power of AI in Education.",
        "Revolutionize Education with AI-Generated Courses.",
        "Learn, Engage, Evolve: The CourseX Experience.",
        "Explore, Create, Share: The New Face of Learning."
    ]
  return (
    <div>
      <div className="h-[50rem] w-full bg-black bg-grid-white/[0.2] relative flex items-center justify-center">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="h-full w-full rounded-md flex md:items-center md:justify-center   antialiased bg-grid-white/[0.02] relative overflow-hidden">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />
          <div className=" p-4 max-w-7xl mx-auto relative z-10  w-full pt-20 md:pt-0">
            <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
              CourseX <br />{" "}
              <span className="text-3xl md:text-5xl">
                Unvei! The Power of AI in Education.
              </span>
            </h1>
            <div className="mt-4 font-normal text-lg text-neutral-300 max-w-lg text-center mx-auto">
                <FlipWords words={words} />
              <div className="flex mt-4 justify-center">
                <BorderMagicButton type="Sign In" redirect="gallery" />
                <BorderMagicButton type="Get Started" redirect="gallery" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// const BorderMagicButton = ({type, redirect}: {type: string, redirect: string}) => {
//   return (
//     <div className="ml-4">
//         <Link href={`/${redirect}`} className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
//         <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
//         <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
//         &nbsp;&nbsp;{type}&nbsp;&nbsp;
//         </span>
//         </Link>
//     </div>
//   );
// };
