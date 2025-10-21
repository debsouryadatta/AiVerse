'use client';

import Banner from "@/components/explore/Banner";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostsList from "@/components/explore/PostsList";
import GalleryTab from "@/components/explore/GalleryTab";
import GamesTab from "@/components/explore/GamesTab";
import { getAllPosts, getCourses, getFeaturedCourses } from "./actions";
import { Loader2 } from "lucide-react";

export default function page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("posts");
  const [isMounted, setIsMounted] = useState(false);

  // Initialize activeTab from URL search params on mount
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") || "posts";
    setActiveTab(tabFromUrl);
    setIsMounted(true);
  }, [searchParams]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsData, coursesData, featuredCoursesData] = await Promise.all([
          getAllPosts(),
          getCourses(),
          getFeaturedCourses()
        ]);
        setPosts(postsData || []);
        setCourses(coursesData || []);
        setFeaturedCourses(featuredCoursesData || []);
      } catch (error) {
        console.error("Error fetching explore data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle tab change and update URL
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    router.push(`?tab=${newTab}`, { scroll: false });
  };

  // Prevent hydration mismatch by only rendering after mount
  if (!isMounted) {
    return (
      <div>
        <Banner />
        <div className="flex flex-col items-center">
          <div className="mt-5 w-full flex flex-col items-center">
          <div className="h-[40vh] w-[93vw] flex justify-center items-center dark:bg-zinc-900">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Banner />
      <div className="flex flex-col items-center">
        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange} 
          className="mt-5 w-full flex flex-col items-center"
        >
          <TabsList className="bg-zinc-400 text-black dark:bg-zinc-800 dark:text-white">
            <TabsTrigger className="px-8" value="posts">
              Posts
            </TabsTrigger>
            <TabsTrigger className="px-8" value="courses">
              Courses
            </TabsTrigger>
            <TabsTrigger className="px-8" value="games">
              Games
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <PostsList posts={posts} />
          </TabsContent>
          <TabsContent value="courses">
            <GalleryTab courses={courses} featuredCourses={featuredCourses} />
          </TabsContent>
          <TabsContent value="games">
            <GamesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}