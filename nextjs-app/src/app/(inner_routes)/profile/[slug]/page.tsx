"use client";

import ProfileHeader from "@/components/profile/ProfileHeader";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { getFollowersAction, getFollowingAction, getUserCoursesAction, getUserProfileAction, isUserAlreadyFollowedAction } from "./actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { User } from "@/types";
import { useFollowersStore, useFollowingStore, useProfileCoursesStore, useProfileUserStore } from "@/store";

type Props = {
  params: {
    slug: string;
  };
};

export default async function page({params: {slug}}: Props) {
  const { courses, setCourses } = useProfileCoursesStore();
  const { user, setUser } = useProfileUserStore();
  const [role, setRole] = useState("");
  const [isUserAlreadyFollowed, setIsUserAlreadyFollowed] = useState(false);
  const session = useSession();
  const router = useRouter();
  const { setFollowers } = useFollowersStore();
  const { setFollowing } = useFollowingStore();
  
  if (!session?.data?.user) {
    toast("You need to be logged in to see Profile.");
    return router.push('/gallery');
  }

  useEffect(() => {
    const fetchCourses = async () => {
      const courses: any = await getUserCoursesAction(slug);
      const profile: any = await getUserProfileAction(slug);
      console.log("Profile", profile);
      setCourses(courses);
      setUser(profile);
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
        <ProfileHeader user={user} role={role} isUserAlreadyFollowed={isUserAlreadyFollowed} setIsUserAlreadyFollowed={setIsUserAlreadyFollowed} />
        <h2 className="text-center mt-10 mb-[-30px] text-2xl font-bold">Courses Created</h2>
        {courses ?
        <div className="mx-auto max-w-[70vw]">
          <HoverEffect items={courses} />
        </div>
        :
        <div className="flex justify-center items-center h-96">
            <h1 className="text-3xl">No courses found</h1>
        </div>
        }
        {/* <HoverEffect /> */}
    </div>
  );
}
