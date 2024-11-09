"use client";

import {
  addLikeAction,
  addToBookmarkAction,
  checkLikeBookmarkStatusAction,
  getAuthorDetails,
  getLikesCountAction,
  removeFromBookmarkAction,
  removeLikeAction,
} from "@/app/(inner_routes)/course/[...slug]/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, FileDown, Share2, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import CommentSec from "./CommentSec";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ShareDialog } from "./ShareDialog";
import Link from "next/link";
import SelectVisibility from "./SelectVisibility";

export default function CourseDetail({ course }: { course: any }) {
  const [author, setAuthor] = useState<any>(null);
  const [bookmark, setBookmark] = useState(false);
  const [like, setLike] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const session = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAuthorDetails(course.userId);
        setAuthor(res ? res : null);
      } catch (error) {
        console.log("Error", error);
        // toast("Error fetching info")
      }
    };

    const checkLikeBookmarkStatus = async () => {      
      try {
        const {bookmark, like} = await checkLikeBookmarkStatusAction(
          session?.data?.user?.id!,
          course.id
        )
        
        if(bookmark) setBookmark(true)
        if(like) setLike(true)
      } catch (error) {
        console.log("Error", error);
        // toast("Error fetching info")
      }
    }

    const getLikesCount = async () => {
      try {
        const res = await getLikesCountAction(course.id);
        setLikesCount(res);
      } catch (error) {
        console.log("Error", error);
        // toast("Error fetching info")
      }
    
    }

    fetchData();
    checkLikeBookmarkStatus();
    getLikesCount();
  }, [session]);

  const addToBookmark = async () => {
    try {
      if(!session?.data?.user) return toast("Please login to bookmark");
      const res = await addToBookmarkAction(
        session?.data?.user?.id!,
        course.id
      );
      setBookmark(true);
      toast("Added to bookmark");
    } catch (error) {
      toast("Error adding to bookmark");
    }
  };

  const removeFromBookmark = async () => {
    try {
      if(!session?.data?.user) return toast("Please login to bookmark");
      const res = await removeFromBookmarkAction(
        session?.data?.user?.id!,
        course.id
      );
      setBookmark(false);
      toast("Removed from bookmark");
    } catch (error) {
      toast("Error removing from bookmark");
    }
  };

  const addLike = async () => {
    try {
      if(!session?.data?.user) return toast("Please login to like");
      const res = await addLikeAction(session?.data?.user?.id!, course.id);
      setLike(true);
      setLikesCount(likesCount + 1)
      toast("Course liked");
    } catch (error) {
      toast("Error liking");
    }
  }

  const removeLike = async () => {
    try {
      if(!session?.data?.user) return toast("Please login to like");
      const res = await removeLikeAction(session?.data?.user?.id!, course.id);
      setLike(false);
      setLikesCount(likesCount - 1)
      toast("Course unliked");
    } catch (error) {
      toast("Error unliking");
    }
  }

    return (
      <>
        <div className="mt-6 p-2 flex justify-between">
          <div className="mr-2 flex justify-center items-center">
            <AvatarComp user={author} />
            <span className="ml-2 text-lg font-bold">{author?.name}</span>
          </div>
          <div className="flex justify-between w-[100px] sm:w-[400px]">
            <div className="">
              <SelectVisibility course={course} />
            </div>
            {like ? (
              <button onClick={removeLike} className="mr-2 bg-slate-200 dark:bg-zinc-900 rounded-2xl p-2">
                <div className="flex">
                  <ThumbsUp fill="#fff" />
                  <span className="text-xl mt-[1.5px] ml-1 font-medium">{likesCount}</span>
                </div>
              </button>
            ) : (
              <button onClick={addLike} className="mr-2 bg-slate-200 dark:bg-zinc-900 rounded-2xl p-2">
                <div className="flex">
                  <ThumbsUp />
                  <span className="text-xl mt-[1.5px] ml-1 font-medium">{likesCount}</span>
                </div>
              </button>
            )}
            <button className="mr-2 bg-slate-200 dark:bg-zinc-900 rounded-2xl p-2">
              <ShareDialog course={course} />
            </button>
            {bookmark ? (
              <button onClick={removeFromBookmark} className="mr-2 bg-slate-200 dark:bg-zinc-900 rounded-2xl p-2">
                <Bookmark fill="#fff" />
              </button>
            ) : (
              <button onClick={addToBookmark} className="mr-2 bg-slate-200 dark:bg-zinc-900 rounded-2xl p-2">
                <Bookmark />
              </button>
            )}
            <Link href={`/export/${course?.id}`} className="bg-slate-200 dark:bg-zinc-900 rounded-2xl p-2 cursor-pointer">
              <FileDown />
            </Link>
          </div>
        </div>

        <CommentSec author={author} course={course} />
      </>
    );
  };

  export function AvatarComp({user}: {user: any}) {
    return (
      <Avatar className="w-[40px] h-[40px]">
        <AvatarImage src={user?.image} />
        <AvatarFallback>{user?.name[0]}</AvatarFallback>
      </Avatar>
    );
  }
