"use client";
import { getUserCreditsAction } from "@/app/(inner_routes)/create/actions";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react";
import axios from "axios";

export default function SubscriptionAction({credits}: {credits: number}) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-1/2 p-4 mx-auto mt-4 rounded-md dark:bg-zinc-900 border border-zinc-400 dark:border-zinc-700">
      {credits} / 50 Free Generations
      <Progress
        className="mt-2"
        value={credits ? credits * 100/50 : 0}
      />
      <Button
        disabled={loading}
        onClick={handleSubscribe}
        className="mt-3 font-bold text-white transition bg-gradient-to-tr from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
      >
        Upgrade
        <Zap className="fill-white ml-2" />
      </Button>
    </div>
  );
}
