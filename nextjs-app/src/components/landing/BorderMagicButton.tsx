"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

export default function BorderMagicButton({
  type,
  redirect,
}: {
  type: string;
  redirect: string;
}) {
  if (type == "Sign In") {
    return (
      <div className="ml-4">
        <button
          onClick={async() => await signIn("google")}
          className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            &nbsp;&nbsp;{type}&nbsp;&nbsp;
          </span>
        </button>
      </div>
    );
  }



  if (type == "Get Started") {
    return (
      <div className="ml-4">
        <Link
          href={`/gallery`}
          className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            &nbsp;&nbsp;{type}&nbsp;&nbsp;
          </span>
        </Link>
      </div>
    );
  }
}
