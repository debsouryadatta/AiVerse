"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { CourseWithUser, User } from "@/types";

export default function SearchResults({courses, profiles}: {courses?: CourseWithUser[], profiles?: User[]}) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();



  return (
    <>
      <ul className=" mx-auto w-full gap-4">






        {courses && courses?.length === 0 && (
            <div className="flex items-center justify-center gap-1 my-20">
              <IconSearch size={30} stroke={2} />
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                Search
              </h3>
            </div>
          )}

        {courses && courses?.map((course, index: number) => (
          <motion.div
            layoutId={`card-${course.title}-${id}`}
            key={`card-${course.title}-${id}`}
            // onClick={() => setActive(card)}
            className="p-4 flex flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-row ">
              <motion.div layoutId={`image-${course.title}-${id}`}>
                <Image
                  width={100}
                  height={100}
                  src={course.image}
                  alt={course.title}
                  className="h-10 w-10 sm:h-14 sm:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${course.title}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-sm sm:text-md"
                >
                  {course.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${course.id}-${index}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-sm sm:text-md"
                >
                  {course.user.name}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${course.title}-${id}`}
              className="px-2 py-1 text-xs rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-0 sm:px-4 sm:py-2 sm:text-sm"
              onClick={() => router.push(`/course/${course.id}`)}
            >
              Open
            </motion.button>
          </motion.div>
        ))}







        {profiles && profiles?.length === 0 && (
          <div className="flex items-center justify-center gap-1 my-20">
            <IconSearch size={30} stroke={2} />
            <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
              Search
            </h3>
          </div>
        )}

        {profiles && profiles?.map((profile, index: number) => (
          <motion.div
            layoutId={`card-${profile.name}-${id}`}
            key={`card-${profile.name}-${id}`}
            // onClick={() => setActive(card)}
            className="p-4 flex flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-row items-center">
              <motion.div layoutId={`image-${profile.name}-${id}`}>
                <Image
                  width={100}
                  height={100}
                  src={profile.image!}
                  alt={profile.name!}
                  className="h-10 w-10 sm:h-14 sm:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${profile.name}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-sm sm:text-md"
                >
                  {profile.name}
                </motion.h3>
                <motion.p
                  layoutId={`description-${profile.email}-${index}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                >
                  {/* {profile.email} */}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${profile.name}-${id}`}
              className="px-2 py-1 text-xs rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-0 sm:px-4 sm:py-2 sm:text-sm"
              onClick={() => router.push(`/profile/${profile.id}`)}
            >
              Profile
            </motion.button>
          </motion.div>
        ))}









      </ul>
    </>
  );
}


