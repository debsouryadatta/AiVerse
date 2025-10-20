"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { Trash2 } from "lucide-react";
import { Button } from "./button";
import { deleteBookmarkAction } from "@/app/(inner_routes)/bookmarks/actions";
import { toast } from "sonner";
import { BookmarkCourse, CourseWithUser } from "@/types";
import { deleteCourseAction } from "@/app/(inner_routes)/profile/[slug]/actions";

export const HoverEffect = ({
  items,
  className,
  page,
  setCourses,
  setProfileCourses,
}: {
  items: {
    id: string;
    title: string;
    image: string;
    description: string;
    user?: any;
    bookmarkId?: string;
  }[] | undefined;
  className?: string;

  // For bookmark page
  page?: string;
  setCourses?: Dispatch<React.SetStateAction<BookmarkCourse[]>>;
  setProfileCourses?: (courses: CourseWithUser[]) => void;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const session = useSession();

  const deleteBookmark = async (bookmarkId: string) => {
    try {
      await deleteBookmarkAction(bookmarkId);
      if (setCourses) {
        setCourses((prev: BookmarkCourse[]) => prev.filter((item: BookmarkCourse) => item.id !== bookmarkId));
      }
      toast.success("Bookmark deleted successfully");
    } catch (error) {
      console.log("Error", error);
      toast.error("Failed to delete bookmark");
    }
  }

  const deleteCourse = async (courseId: string) => {
    try {
      await deleteCourseAction(courseId);
      if (setProfileCourses) {
        const filteredCourses = items?.filter((item) => item.id !== courseId) as CourseWithUser[];
        setProfileCourses(filteredCourses);
        toast.success("Course deleted successfully");
      }
    } catch (error) {
      console.log("Error", error);      
      toast.error("Failed to delete course");
    }
  }
  

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-10",
        className
      )}
    >
      {items?.map((item, idx) => (
        <div className="flex flex-col">
          <Link
          href={`/course/${item?.id}`}
          key={item?.id}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            {/* <div className="w-full h-40"> */}
              <Image
                src={item.image}
                alt={item.title}
                width={500}
                height={300}
                className="rounded-2xl w-[500px] h-[200px]"
                />
            {/* </div> */}

            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description.slice(0,70)}...</CardDescription>
            <div className="flex justify-start items-end mt-3">
              <AvatarComp user={item?.user} />
              <span className="text-sm ml-1">{item?.user?.name}</span>
            </div>

          </Card>
        </Link>

        {page === "bookmark-page" && 
        <div className="mb-1 mt-[-5px] w-[95%] mx-auto">
            <Button onClick={async() => deleteBookmark(item.bookmarkId!)} className="w-full h-8 bg-zinc-800 dark:bg-white dark:text-black"><Trash2 size={16} /><span className="mt-[0.5px]">Delete</span></Button>
        </div>
      }
        {(page === "profile-page" && session?.data?.user?.id === item?.user?.id) &&
        <div className="mb-1 mt-[-5px] w-[95%] mx-auto">
            <Button onClick={async() => deleteCourse(item.id)} className="w-full h-8 bg-zinc-800 dark:bg-white dark:text-black"><Trash2 size={16} /><span className="mt-[0.5px]">Delete</span></Button>
        </div>
      }
        </div>

      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-1 overflow-hidden bg-gray-100 dark:bg-zinc-800 border border-slate-300 dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-800 dark:text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-2 text-zinc-700 dark:text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};


export function AvatarComp({user}: {user: any}) {
  return (
    <Avatar className="w-[25px] h-[25px]">
      <AvatarImage src={user?.image} />
      <AvatarFallback>{user?.name[0]}</AvatarFallback>
    </Avatar>
  );
}