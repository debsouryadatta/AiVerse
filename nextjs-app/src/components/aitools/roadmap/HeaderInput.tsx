"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input2";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight, Coins, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { generateRoadmapAction } from "@/app/(inner_routes)/aitools/roadmap/actions";
import { Roadmap } from "@/types/roadmap";
import { useGlobalCreditsStore } from "@/store";

export default function HeaderInput({roadmap, setRoadmap}: {roadmap: Roadmap | null, setRoadmap: (roadmap: Roadmap) => void}) {
  const [topic, setTopic] = useState("");
  const { credits, setCredits } = useGlobalCreditsStore();
  const [loading, setLoading] = useState(false);

  const session = useSession();
  const CREDITS_REQUIRED = 25;


  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!topic) {
      toast.error("Please enter a title");
      setLoading(false);
      return;
    }
    if (credits! < CREDITS_REQUIRED) {
      toast.error("Not enough credits");
      setLoading(false);
      return;
    }
    try {
      const response = await generateRoadmapAction(topic, session?.data?.user?.id!);
      setRoadmap(response);
      setCredits(credits! - CREDITS_REQUIRED);
      toast.success("Roadmap generated successfully");
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to generate roadmap");
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
          <form onSubmit={handleGenerate} className="flex space-x-2 flex-col sm:flex-row">
            <Input
              placeholder="Enter a topic to generate a roadmap for"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-grow bg-white dark:bg-transparent dark:border-zinc-600 py-6 mt-[-6px]"
            />
            <Button className="mt-4 sm:mt-0" type="submit" disabled={loading} >
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Generating..." : "Generate"}
              <div className="flex items-center gap-1 text-xs opacity-70 bg-black/20 px-2 py-0.5 ml-2 rounded-full">
                <Coins size={12} className="text-amber-600" />
                <span>{CREDITS_REQUIRED} credits</span>
              </div>
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
      </Card>
    </div>
  );
}
