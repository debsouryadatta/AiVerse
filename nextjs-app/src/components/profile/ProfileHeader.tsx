"use client";

import { toast } from "sonner";
import ProfileListDialog from "./ProfileListDialog";
import {
  followUserAction,
  unfollowUserAction,
} from "@/app/(inner_routes)/profile/[slug]/actions";
import { useSession } from "next-auth/react";
import React from "react";
import EditDialog from "./EditDialog";
import EditDrawer from "./EditDrawer";
import { User } from "@/types";

export default function ProfileHeader({
  user,
  role,
  isUserAlreadyFollowed,
  setIsUserAlreadyFollowed,
}: {
  user: User | null;
  role: string;
  isUserAlreadyFollowed: boolean;
  setIsUserAlreadyFollowed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const session = useSession();

  const followUser = async () => {
    try {
      const result = await followUserAction(
        session?.data?.user?.id!,
        user?.id!
      );
      if (result) {
        setIsUserAlreadyFollowed(true);
        toast("User followed successfully");
      }
    } catch (error) {
      console.log("Error", error);
      toast("Error following user");
    }
  };

  const unfollowUser = async () => {
    try {
      const result = await unfollowUserAction(
        session?.data?.user?.id!,
        user?.id!
      );
      if (result) {
        setIsUserAlreadyFollowed(false);
        toast("User unfollowed successfully");
      }
    } catch (error) {
      console.log("Error", error);
      toast("Error unfollowing user");
    }
  };

  return (
    <div>
      <div className="sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto bg-white dark:bg-zinc-900 shadow-xl rounded-lg text-gray-900">
        <div className="rounded-t-lg h-72 overflow-hidden">
          <img
            className="object-cover object-top w-full"
            src="https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Mountain"
          />
        </div>
        <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
          <img
            className="object-cover object-center h-32"
            src={user?.image || ""}
          />
        </div>
        <div className="text-center mt-2">
          <h2 className="font-semibold dark:text-gray-300">{user?.name}</h2>
          <p className="text-gray-500 w-[90vw] sm:w-[80vw] md:w-[50vw] mx-auto text-center">
            {user?.bio}
          </p>
        </div>
        <ul className="py-4 mt-2 text-gray-700 dark:text-gray-300 text-sm flex items-center justify-around max-w-sm mx-auto">
          <li className="flex flex-col items-center justify-around">
            20
            <div>Courses</div>
          </li>
          <li className="flex flex-col items-center justify-between">
            <ProfileListDialog type="followersList" />
          </li>
          <li className="flex flex-col items-center justify-around">
            <ProfileListDialog type="followingList" />
          </li>
        </ul>
        <div className="p-4 border-t mx-8 mt-2 flex justify-center">
          {role === "owner" ? (
            <EditDrawer />
          ) : isUserAlreadyFollowed ? (
            <button
              onClick={unfollowUser}
              className="w-1/2 block mx-auto rounded-full bg-gray-900 dark:bg-gray-300 hover:shadow-2xl dark:hover:shadow-gray-300/30 font-semibold text-white dark:text-gray-900 px-6 py-2"
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={followUser}
              className="w-1/2 block mx-auto rounded-full bg-gray-900 dark:bg-gray-300 hover:shadow-2xl dark:hover:shadow-gray-300/30 font-semibold text-white dark:text-gray-900 px-6 py-2"
            >
              Follow
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
