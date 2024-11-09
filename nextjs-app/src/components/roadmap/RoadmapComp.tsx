import { Roadmap } from "@/types/roadmap";
import React, { useRef, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { saveRoadmapAction } from "@/app/(inner_routes)/roadmap/actions";
import { useSession } from "next-auth/react";
import html2canvas from 'html2canvas';
import { useTheme } from "next-themes";

export default function RoadmapComp({ roadmap }: { roadmap: Roadmap | null }) {
  const componentToExport = useRef<HTMLDivElement>(null);
  const session = useSession();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const saveRoadmap = async () => {
    try {
      const response = await saveRoadmapAction(roadmap!, session?.data?.user?.id!);
      if (response) {
        toast.success("Roadmap saved to bookmarks successfully");
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Failed to save roadmap");
    }
  }

  const exportRoadmap = async() => {
    if (componentToExport.current) {
      try {
        const canvas = await html2canvas(componentToExport.current, {
          scale: 2,
          backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', // Adjust background based on theme
          useCORS: true,
        });
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'roadmap.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, 'image/jpeg', 0.9);
        toast.success("Roadmap exported successfully");
      } catch (error) {
        console.error('Error exporting roadmap:', error);
        toast.error('Failed to export roadmap');
      }
    }
  }

  if (!mounted) return null; // This line to prevent hydration mismatch

  return (
    <div ref={componentToExport} className="min-h-screen text-zinc-800 dark:text-white bg-white dark:bg-zinc-900 p-8 flex flex-col items-center mb-32">
      <h1 className="text-4xl font-bold mb-12 text-zinc-800 dark:text-zinc-200">
        {roadmap?.title}
      </h1>
      <div className="relative w-full max-w-4xl">
        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-zinc-800 dark:bg-zinc-200 opacity-50"></div>
        {roadmap?.topics.map((topic, index) => {
          const half = Math.ceil(topic.subtopics.length / 2);
          const leftSubtopics = topic.subtopics.slice(0, half);
          const rightSubtopics = topic.subtopics.slice(half);

          return (
            <div key={index} className="mb-24 relative">
              <div className="relative z-10 bg-yellow-400 p-3 rounded-md shadow-lg max-w-xs mx-auto mb-8">
                <h2 className="text-xl font-semibold text-center text-black">
                  {topic.title}
                </h2>
              </div>
              <div className="flex justify-between items-start">
                <div className="w-1/2 pr-8 text-right">
                  {leftSubtopics.map((subtopic, subIndex) => (
                    <div
                      key={subIndex}
                      className="mb-4 p-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white rounded-md shadow-md border border-gray-300 dark:border-gray-700 inline-block mx-1"
                    >
                      {subtopic}
                    </div>
                  ))}
                </div>
                <div className="w-1/2 pl-8 text-left">
                  {rightSubtopics.map((subtopic, subIndex) => (
                    <div
                      key={subIndex}
                      className="mb-4 p-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white rounded-md shadow-md border border-gray-300 dark:border-gray-700 inline-block mx-1"
                    >
                      {subtopic}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex mt-20 gap-6">
        <Button onClick={saveRoadmap} className="w-24">Save</Button>
        <Button onClick={exportRoadmap} className="w-24">Export</Button>
      </div>
    </div>
  );
}