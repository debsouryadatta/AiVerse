"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function page() {
  return (
    <div className="min-h-[75vh]">
      <div className="w-full text-white flex flex-col justify-center items-center">
        <img
          className="w-full h-[200px] object-cover"
          src="https://res.cloudinary.com/diyxwdtjd/image/upload/v1731335982/projects/Untitled_design_1_cuceg3.jpg"
          alt="/"
        />
        {/* <Search /> */}
        <Tabs defaultValue="courses" className="flex flex-col justify-center items-center mt-10">
        <TabsList className="flex justify-center items-center bg-zinc-400 text-black dark:bg-zinc-800 dark:text-white w-96">
          <TabsTrigger className="w-48" value="courses">Courses</TabsTrigger>
          <TabsTrigger className="w-48" value="posts">Posts</TabsTrigger>
        </TabsList>
        <TabsContent className="w-[350px] sm:w-[500px] lg:w-[800px]" value="courses">
          {/* <SearchResults courses={courses} /> */}
        </TabsContent>
        <TabsContent className="w-[350px] sm:w-[500px] lg:w-[800px]" value="posts">
          {/* <PostResults posts={posts} /> */}
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
