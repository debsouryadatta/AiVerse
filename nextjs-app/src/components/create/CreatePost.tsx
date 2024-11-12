"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/utils/cn";
import { FileUpload } from "../ui/file-upload";
import { InfoIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getPhotoUrlAction, createPostAction } from "@/app/(inner_routes)/create/actions";
import { Textarea } from "../ui/textarea";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mediaType, setMediaType] = useState("image");
  const [isPosting, setIsPosting] = useState(false);

  const router = useRouter();
  const session = useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) {
      return toast.error("Post content cannot be empty");
    }

    setIsPosting(true);
    try {
      const userId = session.data?.user?.id;
      if (!userId) throw new Error("User not authenticated");

      const post = await createPostAction(
        session.data?.user?.id!,
        content,
        mediaUrls[0] ? mediaUrls[0] : "",
        mediaUrls[0] ? mediaType : ""
      );
      
      console.log("Post created:", post);
      toast.success("Post created successfully!");
      router.push("/explore");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      const photoUrl = await getPhotoUrlAction(formData);
      setMediaUrls([...mediaUrls, photoUrl]);
      toast.success("Media uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload media");
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-zinc-950">
      <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
        Create Post
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Share your thoughts with the community
      </p>

      <div className="flex p-4 mt-5 border-none bg-zinc-200 dark:bg-zinc-800 rounded-md">
        <InfoIcon className="w-12 h-12 mr-3 text-blue-400" />
        <div>
          Share your thoughts, ideas, or questions with the community. Add media to make your post more engaging!
        </div>
      </div>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label className="text-lg">What's on your mind?</Label>
          <Textarea
            placeholder="Type your thoughts here..."
            className="min-h-[150px] resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </LabelInputContainer>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="mb-8 flex items-center">
          <LabelInputContainer>
            <Label className="text-lg">Media Type</Label>
          </LabelInputContainer>
          <div className="px-2 dark:bg-zinc-900 rounded-md cursor-pointer">
            <select 
              defaultValue="image" 
              className="rounded-md p-2 dark:bg-zinc-900 focus:outline-none cursor-pointer"
              onChange={(e) => setMediaType(e.target.value)}
            >
              <option value="image">Image</option>
              {/* <option value="video">Video</option> */}
            </select>
          </div>
        </div>


        <LabelInputContainer className="mb-4">
          <Label className="text-lg">Add Media</Label>
          <div className="w-full mx-auto border border-dashed bg-gray-300 dark:bg-zinc-950 border-neutral-200 dark:border-neutral-800 rounded-lg">
            <FileUpload onChange={handleFileUpload} />
          </div>
        </LabelInputContainer>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />


        <button
          className={cn(
            "bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]",
            isPosting && "opacity-70 cursor-not-allowed"
          )}
          type="submit"
          disabled={isPosting}
        >
          {isPosting ? (
            <div className="flex justify-center items-center">
              <span>Posting...</span>
              <Loader2 className="animate-spin w-5 h-5 ml-1" />
            </div>
          ) : (
            "Post"
          )}
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
