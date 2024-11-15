"use client";

import ProfileHeader from "@/components/profile/ProfileHeader";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { getFollowersAction, getFollowingAction, getUserCoursesAction, getUserPostsAction, getUserProfileAction, isUserAlreadyFollowedAction } from "./actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { CourseWithUser, ExplorePost, User } from "@/types";
import { useFollowersStore, useFollowingStore, useProfileCoursesStore, useProfileUserStore } from "@/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfilePostsStore } from "@/store/post";
import CoursesCreated from "@/components/profile/CoursesCreated";
import PostsCreated from "@/components/profile/PostsCreated";

type Props = {
  params: {
    slug: string;
  };
};

export default async function page({params: {slug}}: Props) {
  const { courses, setCourses } = useProfileCoursesStore();
  const { posts, setPosts } = useProfilePostsStore();
  const { user, setUser } = useProfileUserStore();
  const [role, setRole] = useState("");
  const [isUserAlreadyFollowed, setIsUserAlreadyFollowed] = useState(false);
  const session = useSession();
  const router = useRouter();
  const { setFollowers } = useFollowersStore();
  const { setFollowing } = useFollowingStore();
  
  // if (!session?.data?.user) {
  //   toast("You need to be logged in to see Profile.");
  //   return router.push('/gallery');
  // }

  useEffect(() => {
    const fetchCourses = async () => {
      const courses: CourseWithUser[] = await getUserCoursesAction(slug);
      const profile: User | null = await getUserProfileAction(slug);
      const posts: ExplorePost[] = await getUserPostsAction(slug);
      console.log("Profile", profile);
      console.log("Posts", posts);
      setCourses(courses);
      setUser(profile);
      setPosts(posts);
    }
    fetchCourses();

    const isUserAlreadyFollowed = async () => {
      try {
        const result = await isUserAlreadyFollowedAction(session?.data?.user?.id!, slug);
        setIsUserAlreadyFollowed(result);
      } catch (error) {
        console.log("Error", error);
      }
    } 
    isUserAlreadyFollowed();

    const getFollowers = async () => {
      try {
        const followers: User[] = await getFollowersAction(slug);
        setFollowers(followers);
        console.log("Followers", followers);
      } catch (error) {
        console.log("Error", error);
        toast("Error getting followers");
      }
    }
    getFollowers();

    const getFollowing = async () => {
      try {
        const following: User[] = await getFollowingAction(slug);
        setFollowing(following);
        console.log("Following", following);
      } catch (error) {
        console.log("Error", error);
        toast("Error getting following");
      }
    }
    getFollowing();

    if(session?.data?.user?.id === slug){
      setRole("owner");
    } else {
      setRole("guest");
    }
  }, [])
  
    
  return (
    <div className="min-h-[75vh]">
        <ProfileHeader user={user} slug={slug} isUserAlreadyFollowed={isUserAlreadyFollowed} setIsUserAlreadyFollowed={setIsUserAlreadyFollowed} />
        <Tabs defaultValue="courses" className="flex flex-col justify-center items-center mt-10">
        <TabsList className="flex justify-center items-center bg-zinc-400 text-black dark:bg-zinc-800 dark:text-white w-96">
          <TabsTrigger className="w-48" value="courses">Courses</TabsTrigger>
          <TabsTrigger className="w-48" value="posts">Posts</TabsTrigger>
        </TabsList>
        <TabsContent className="w-[350px] sm:w-[500px] lg:w-[800px]" value="courses">
          <CoursesCreated />
        </TabsContent>
        <TabsContent className="w-[350px] sm:w-[500px] lg:w-[800px]" value="posts">
          <PostsCreated />
        </TabsContent>
      </Tabs>
    </div>
  );
}
