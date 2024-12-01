import { Coins } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserCreditsAction } from "@/app/(inner_routes)/create/actions";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CreditsDisplay() {
  const [credits, setCredits] = useState<number | null>(null);
  const session = useSession();

  useEffect(() => {
    const getUserCredits = async () => {
      try {
        const credits = await getUserCreditsAction(session?.data?.user?.id!);
        setCredits(credits!);
      } catch (error) {
        console.error("Error fetching credits:", error);
      }
    };

    if (session?.data?.user?.id) {
      getUserCredits();
    }
  }, [session?.data?.user?.id]);

  if (!session?.data?.user || credits === null) return null;

  return (
    <Link href="/settings" className="group">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 transition-colors backdrop-blur-md border border-zinc-200 dark:border-white/20">
        <Coins className="w-4 h-4 text-amber-500 dark:text-yellow-400 group-hover:text-amber-600 dark:group-hover:text-yellow-300 transition-colors" />
        <span className="text-sm font-medium text-zinc-800 dark:text-white/90 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
          {credits.toLocaleString()} credits
        </span>
      </div>
    </Link>
  );
}
