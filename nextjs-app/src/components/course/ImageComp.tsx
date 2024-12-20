"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import CourseDetail from "./CourseDetail";
import Image from "next/image";

type Props = {
  course: {
    id: string;
    title: string;
    image: string;
    description: string;
  } | undefined;
  firstChapterId: string | undefined;
};

export function ImageComp({course, firstChapterId}: Props) {
  return (
    <div className="relative">
      <div className="relative h-[50vh] w-[90vw] sm:h-[90vh] sm:w-[70vw] rounded-2xl overflow-hidden mx-auto">
        <motion.div
          initial={{
            opacity: 0,
            y: -80,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="absolute inset-0 z-10 flex flex-col justify-center items-center bg-black/50"
        >
          <motion.p className="font-bold text-2xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
            {course?.title} <br />
          </motion.p>
          <span className="text-center text-xs md:text-xl w-[60vw]">{course?.description}</span>
          <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
            <Link href={`/course/${course?.id}/${firstChapterId}`}>Start Learning →</Link>
            <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
          </button>
        </motion.div>
        <Image 
          src={course?.image || ""}
          alt={course?.title || "Course Image"}
          fill
          className="object-cover"
          priority
        />
      </div>
      <CourseDetail course={course} />
    </div>
  );
}
