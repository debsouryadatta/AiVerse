"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input2";
import { AvatarComp } from "./CourseDetail";
import { text } from "stream/consumers";
import {
  addCommentAction,
  deleteCommentAction,
  getCommentsAction,
} from "@/app/(inner_routes)/course/[...slug]/actions";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { EllipsisVertical } from "lucide-react";
import { CommentOptions } from "./CommentOptions";

export default function CommentSec({
  author,
  course,
}: {
  author: any;
  course: any;
}) {
  const commentRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [comments, setComments] = useState<any[]>([]);

  const session = useSession();

  const getComments = async () => {
    try {
      const res: any = await getCommentsAction(course.id);
      console.log("Comments", res);
      
      setComments(res);
    } catch (error) {
      console.log("Error", error);
      toast("Error fetching comments");
    }
  };

  const addComment = async () => {
    
    try {
      setInputValue("");
      if (!session?.data?.user) return toast("Please login to comment");
      const res: any = await addCommentAction(
        session?.data?.user?.id!,
        course.id,
        inputValue
      );
      await getComments();
      toast("Comment added successfully");
    } catch (error) {
      console.log("Error", error);
      toast("Error adding comment");
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const res = await deleteCommentAction(commentId);
      const newComments = comments.filter((comment) => comment.id !== commentId);
      setComments(newComments);
      toast("Comment deleted successfully");
    } catch (error) {
      console.log("Error", error);
      toast("Error deleting comment");
    }
  }

  const onFocusFunc = () => {
    commentRef.current?.classList.add("flex");
    commentRef.current?.classList.remove("hidden");
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div>
      {session?.data?.user && (
        <div className="mt-20 flex items-center bg-white dark:bg-zinc-950 p-4 rounded-xl">
          <div>
            <AvatarComp user={session?.data?.user} />
          </div>
          <form className="w-full" onSubmit={(e) => e.preventDefault()}>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={onFocusFunc}
              onSubmit={() => console.log("Hello")}
              placeholder="Add a comment..."
              className="focus:outline-1 border-0 border-b-2 dark:bg-zinc-950"
            />
          </form>
        </div>
      )}

      <div ref={commentRef} className="justify-end mt-2 hidden">
        <Button
          onClick={() => {
            setInputValue("");
            commentRef.current?.classList.add("hidden");
          }}
          variant={"outline"}
          size={"sm"}
          className="mr-2"
        >
          Cancel
        </Button>
        <Button
          onClick={addComment}
          variant={"outline"}
          size={"sm"}
          className=""
        >
          Comment
        </Button>
      </div>

      <h2 className="text-xl mt-6 font-semibold">Comments</h2>
      {comments?.map((comment: any) => (
        <div
          key={comment.id}
          className="mt-6 flex items-center justify-between w-full dark:bg-zinc-950 p-4 rounded-xl"
        >
          <div className="flex">
            <AvatarComp user={comment.user} />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">@{comment.user.name}</span>
              <span className="ml-2 text-sm">{comment.text}</span>
            </div>
          </div>
          {(session?.data?.user && session?.data?.user?.id === comment.userId) && (
          <button>
            <CommentOptions deleteComment={deleteComment} commentId={comment.id} />
          </button>
          )}
        </div>
      ))}
    </div>
  );
}
