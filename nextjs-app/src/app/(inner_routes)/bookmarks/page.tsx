"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookmarkCourse, BookmarkPost } from "@/types";
import { getBookmarkCoursesAction, getBookmarkPostsAction } from "./actions";
import { useSession } from "next-auth/react";
import BmCourses from "@/components/bookmarks/BmCourses";
import BmPosts from "@/components/bookmarks/BmPosts";
import LoadingComponent from "../loading";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function page() {
  const [bookmarkCourses, setBookmarkCourses] = useState<BookmarkCourse[]>([]);
  const [bookmarkPosts, setBookmarkPosts] = useState<BookmarkPost[]>([]);
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    const getBookmarkCourses = async () => {
      setLoading(true);
      try {
        const bookmarkCourses = await getBookmarkCoursesAction(session?.data?.user?.id!);
        console.log("Bookmark Courses", bookmarkCourses);
        setBookmarkCourses(bookmarkCourses);
      } catch (error) {
        console.log("Error", error);
      } finally {
        setLoading(false);
      }
    }
    const getBookmarkPosts = async () => {
      setLoading(true);
      try {
        const bookmarkPosts = await getBookmarkPostsAction(session?.data?.user?.id!);
        console.log("Bookmark Posts", bookmarkPosts);
        setBookmarkPosts(bookmarkPosts);
      } catch (error) {
        console.log("Error", error);
      } finally {
        setLoading(false);
      }
    }
    getBookmarkCourses();
    getBookmarkPosts();
  }, [])

  if (!session?.data?.user) {
    toast("You need to be logged in to see your bookmarks.");
    return router.push("/explore");
  }

  if(loading) {
    return <LoadingComponent/>
  }

  return (
    <div className="min-h-[75vh]">
      <div className="w-full text-white flex flex-col justify-center items-center">
        <img
          className="w-full h-[200px] object-cover"
          src="https://res.cloudinary.com/diyxwdtjd/image/upload/v1731335982/projects/Untitled_design_1_cuceg3.jpg"
          alt="/"
        />
        <Tabs defaultValue="courses" className="flex flex-col justify-center items-center mt-10">
        <TabsList className="flex justify-center items-center bg-zinc-400 text-black dark:bg-zinc-800 dark:text-white w-96">
          <TabsTrigger className="w-48" value="courses">Courses</TabsTrigger>
          <TabsTrigger className="w-48" value="posts">Posts</TabsTrigger>
        </TabsList>
        <TabsContent className="w-[350px] sm:w-[700px] lg:w-[1000px]" value="courses">
          <BmCourses bookmarkCourses={bookmarkCourses} setBookmarkCourses={setBookmarkCourses} />
        </TabsContent>
        <TabsContent className="w-[350px] sm:w-[500px] lg:w-[800px]" value="posts">
          <BmPosts bookmarkPosts={bookmarkPosts} setBookmarkPosts={setBookmarkPosts} />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
