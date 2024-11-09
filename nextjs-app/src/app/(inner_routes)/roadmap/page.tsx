"use client";

import HeaderInput from '@/components/roadmap/HeaderInput'
import RoadmapComp from '@/components/roadmap/RoadmapComp'
import { Roadmap } from '@/types/roadmap';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const roadmapDemo: Roadmap = {
  title: 'Web Development',
  topics: [{
    title: 'Programming Languages',
    subtopics: ['Python', 'JavaScript', 'Java', 'C++', 'PHP', 'Ruby']
  },
  {
    title: 'Frontend Development',
    subtopics: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Vue.js', 'Angular.js', 'Bootstrap']
  },
  {
    title: 'Backend Development',
    subtopics: ['Node.js', 'Flask', 'Django', 'Express.js', 'Ruby on Rails', 'Spring Boot']
  },
  {
    title: 'Backend Development',
    subtopics: ['Node.js', 'Flask', 'Django', 'Express.js', 'Ruby on Rails', 'Spring Boot']
  },
  {
    title: 'Backend Development',
    subtopics: ['Node.js', 'Flask', 'Django', 'Express.js', 'Ruby on Rails', 'Spring Boot']
  }
]}

export default function page() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)

  const roadmapRef = useRef<HTMLDivElement>(null)
  const session = useSession();
  const router = useRouter();

  if (!session?.data?.user) {
    toast("You need to be logged in to generate a roadmap.");
    return router.push('/gallery');
  }

  useEffect(() => {
    if (roadmap && roadmapRef.current) {
      roadmapRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [roadmap])


  return (
    <div>
      <div>
        <HeaderInput roadmap={roadmap} setRoadmap={setRoadmap} />
      </div>
      {
        roadmap && (
          <div ref={roadmapRef}>
            <RoadmapComp roadmap={roadmap} />
          </div>
        )
      }
    </div>
  )
}
