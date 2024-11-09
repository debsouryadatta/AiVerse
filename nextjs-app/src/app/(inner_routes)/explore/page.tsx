import Banner from "@/components/explore/banner";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function page() {
  return (
    <div>
      <Banner />
      <div className="flex justify-center items-center">
      <Tabs defaultValue="account" className="mt-5">
        <TabsList className="bg-zinc-400 text-black dark:bg-zinc-800 dark:text-white">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="roadmaps">Roadmaps</TabsTrigger>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
