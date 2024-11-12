import Banner from "@/components/explore/Banner";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostsList from "@/components/explore/PostsList";
import { prisma } from "@/lib/db";
import GalleryTab from "@/components/explore/GalleryTab";

const getAllPosts = async () => {
  try {
    const res = await prisma.post.findMany({
      include: {
        user: true,
        comments: true,
        likes: true,
        bookmarks: true,
      }
    })
    return res;
  } catch (error) {
    console.log(error);
  }
}

export default async function page() {
  const posts = await getAllPosts() || [];
  console.log("Posts: ", posts);

  return (
    <div>
      <Banner />
      <div className="flex flex-col items-center">
        <Tabs defaultValue="posts" className="mt-5 w-full max-w-2xl flex flex-col items-center">
          <TabsList className="bg-zinc-400 text-black dark:bg-zinc-800 dark:text-white w-96">
            <TabsTrigger className="w-48" value="posts">
              Posts
            </TabsTrigger>
            <TabsTrigger className="w-48" value="courses">
              Courses
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <PostsList posts={posts} />
          </TabsContent>
          <TabsContent value="courses">
            <GalleryTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
