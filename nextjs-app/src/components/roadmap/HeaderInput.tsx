"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input2";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  checkSubscriptionAction,
  getUserCreditsAction,
} from "@/app/(inner_routes)/create/actions";
import { toast } from "sonner";
import SubscriptionAction from "../create/SubscriptionAction";
import { generateRoadmapAction } from "@/app/(inner_routes)/roadmap/actions";
import { Roadmap } from "@/types/roadmap";

export default function HeaderInput({roadmap, setRoadmap}: {roadmap: Roadmap | null, setRoadmap: (roadmap: Roadmap) => void}) {
  const [topic, setTopic] = useState("");
  const [credits, setCredits] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(false);

  const session = useSession();

  useEffect(() => {
    const getUserCredits = async () => {
      try {
        const credits = await getUserCreditsAction(session?.data?.user?.id!);
        setCredits(credits!);
      } catch (error) {
        console.log("Error", error);
      }
    };
    const checkPro = async () => {
      try {
        const isPro = await checkSubscriptionAction(session?.data?.user?.id!);
        console.log("Is Pro", isPro);
        setIsPro(isPro);
      } catch (error) {
        console.log("Error", error);
      }
    };
    getUserCredits();
    checkPro();
  }, [session]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!topic) {
      toast.error("Please enter a title");
      return;
    }
    try {
      const response = await generateRoadmapAction(topic, isPro, session?.data?.user?.id!);
      setRoadmap(response);
      setCredits(credits - 1);
      toast.success("Roadmap generated successfully");
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-foreground p-4">
      <Card className="w-full max-w-2xl bg-gray-200 dark:bg-zinc-900 border-none">
        <CardHeader className="text-center">
          <CardTitle className="max-w-7xl pl-4 mx-auto text-3xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
            Generate roadmaps with AI
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Enter a topic and let the AI generate a roadmap for you
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="flex space-x-2">
            <Input
              placeholder="Enter a topic to generate a roadmap for"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-grow bg-white dark:bg-transparent dark:border-zinc-600 py-6 mt-[-6px]"
            />
            <Button type="submit" disabled={loading} >
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Generating..." : "Generate"}
            </Button>
          </form>
          <div className="flex flex-wrap justify-center space-x-4 mt-4">
            {["OAuth", "UI / UX", "SRE", "DevRel"].map((item) => (
              <Button
                onClick={() => setTopic(item)}
                className="p-2 my-1 dark:bg-zinc-800 dark:hover:bg-zinc-900"
                key={item}
                variant="outline"
                size="sm"
              >
                {item}
                <ArrowUpRight size={18} />
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          {!isPro && <SubscriptionAction credits={credits} />}
        </CardFooter>
      </Card>
    </div>
  );
}
