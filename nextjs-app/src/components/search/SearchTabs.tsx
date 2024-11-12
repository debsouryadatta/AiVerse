"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchResults from "./SearchResults";
import { CourseWithUser, ExplorePost, User } from "@/types";
import PostResults from "./PostResults";

export default function SearchTabs({courses, posts, profiles}: {courses: CourseWithUser[], posts: ExplorePost[], profiles: User[]}) {
  return (
    <div className="mt-10 w-[300px] sm:w-[600px] lg:w-[900px]">
      <Tabs defaultValue="courses" className="flex flex-col justify-center items-center">
        <TabsList className="flex justify-center items-center bg-zinc-400 text-black dark:bg-zinc-800 dark:text-white">
          <TabsTrigger className="w-48" value="courses">Courses</TabsTrigger>
          <TabsTrigger className="w-48" value="posts">Posts</TabsTrigger>
          <TabsTrigger className="w-48" value="profiles">Profiles</TabsTrigger>
        </TabsList>
        <TabsContent className="w-[350px] sm:w-[500px] lg:w-[800px]" value="courses">
          <SearchResults courses={courses} />
        </TabsContent>
        <TabsContent className="w-[350px] sm:w-[500px] lg:w-[800px]" value="posts">
          <PostResults posts={posts} />
        </TabsContent>
        <TabsContent className="w-[350px] sm:w-[500px] lg:w-[800px]" value="profiles">
        <SearchResults profiles={profiles} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
