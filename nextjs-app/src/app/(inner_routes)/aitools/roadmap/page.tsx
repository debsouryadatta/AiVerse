"use client";

import HeaderInput from '@/components/aitools/roadmap/HeaderInput';
import RoadmapComp from '@/components/aitools/roadmap/RoadmapComp';
import SavedRoadmaps from '@/components/aitools/roadmap/SavedRoadmaps';
import { Roadmap } from '@/types/roadmap';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)

  const roadmapRef = useRef<HTMLDivElement>(null)
  const session = useSession();

  useEffect(() => {
    if (roadmap && roadmapRef.current) {
      setTimeout(() => {
        roadmapRef?.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [roadmap])

  useEffect(() => {
    if (!session.data?.user) {
      toast("You need to be logged in to create a roadmap.");
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Hero Section */}
      <div className="relative w-full h-[100vh] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            style={{ filter: 'brightness(0.7)' }}
          >
            <source
              src="https://cdn.dribbble.com/userupload/16006995/file/original-d940fb9b7d53542e0d887c1e08b60571.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-2xl mx-auto">
            <HeaderInput roadmap={roadmap} setRoadmap={setRoadmap} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        {session?.data?.user && (
          <div className="absolute top-[105px] right-6 z-50 sm:top-[65px]">
            <SavedRoadmaps />
          </div>
        )}
        {
          roadmap && (
            <div ref={roadmapRef}>
              <RoadmapComp roadmap={roadmap} />
            </div>
          )
        }
      </div>
    </div>
  );
}
