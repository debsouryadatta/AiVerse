"use client";

import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { CourseWithUser } from "@/types";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useProfileCoursesStore, useProfileDeleteCoursesStore } from "@/store";
import { deleteCoursesAction } from "@/app/(inner_routes)/profile/[slug]/actions";

export default function DeleteCourseList() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const [courseItems, setCourseItems] = useState<CourseWithUser[]>([]);
  const { courses, setCourses } = useProfileCoursesStore();
  const { deleteCourses, setDeleteCourses } = useProfileDeleteCoursesStore();

  const session = useSession();


  useEffect(() => {
    setCourseItems(courses);
  }, [courses])

  const handleDeleteCourse = async (courseId: string) => {
    setCourseItems((prev) => prev.filter((courseItem) => courseItem.id !== courseId));
    setDeleteCourses([...deleteCourses, courseId]);
  }

  const refreshCourseList = () => {
    setCourseItems(courses);
  }

  const deleteCoursesFunc = async() => {
    try {
      const result = await deleteCoursesAction(deleteCourses, session?.data?.user?.id!);
      if (result) {
        toast("Courses deleted successfully");
        setCourses(courseItems);
        setDeleteCourses([]);
        // router.refresh();
      }
    } catch (error) {
      console.log("Error", error);
      toast("Error deleting courses");
    }
  }
  
  

  return (
    <>
      <h2 className="text-center text-lg mb-2">Delete Courses</h2>
      <ul className=" mx-auto w-full gap-4">
        






        {courseItems && courseItems?.length === 0 && (
            <div className="flex items-center justify-center gap-1 my-20">
              {/* <IconSearch size={30} stroke={2} /> */}
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                No courses to delete
              </h3>
            </div>
          )}

        {courseItems && courseItems?.map((courseItem, index: number) => (
          <motion.div
            layoutId={`card-${courseItem.title}-${id}`}
            key={`card-${courseItem.title}-${id}`}
            // onClick={() => setActive(card)}
            className="p-4 flex flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-row ">
              <motion.div layoutId={`image-${courseItem.title}-${id}`}>
                <Image
                  width={100}
                  height={100}
                  src={courseItem.image}
                  alt={courseItem.title}
                  className="h-10 w-10 sm:h-14 sm:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${courseItem.title}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-sm sm:text-md"
                >
                  {courseItem.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${courseItem.id}-${index}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-sm sm:text-md"
                >
                  {courseItem.user.name}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${courseItem.title}-${id}`}
              className="px-2 py-1 text-xs rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-0 sm:px-4 sm:py-2 sm:text-sm"
              onClick={() => handleDeleteCourse(courseItem.id)}
            >
              Delete
            </motion.button>
          </motion.div>
        ))}






      </ul>
      <div className="flex justify-center items-center">
        <Button onClick={refreshCourseList} className="dark:bg-zinc-950 border-zinc-400 dark:border-zinc-700 mt-10 mb-20 mr-2" variant={"outline"}>Cancel</Button>
        <Button onClick={deleteCoursesFunc} className="dark:bg-zinc-950 border-zinc-400 dark:border-zinc-700 mt-10 mb-20" variant={"outline"}>Update</Button>
      </div>

    </>
  );
}


