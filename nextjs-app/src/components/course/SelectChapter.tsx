import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export function SelectChapter({ courseDetails }: { courseDetails: any }) {
  return (
    <Select>
      <SelectTrigger className="w-[280px] sm:w-[500px] dark:bg-zinc-950 h-14">
        <SelectValue placeholder="Select Chapter" />
      </SelectTrigger>
      <SelectContent className="dark:bg-zinc-950">
        <Link
            className="cursor-pointer hover:bg-slate-900 ml-2 w-full relative flex select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            href={`/course/${courseDetails[0].courseId}`}
          >Course Intro </Link>
        {courseDetails.map((chapter: any, index: number) => (
          <Link
            className="cursor-pointer hover:bg-slate-900 ml-2 w-full relative flex select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            href={`/course/${chapter.courseId}/${chapter.id}`}
            key={chapter.id}
          >Chapter {index+1}: {chapter.title}</Link>
        ))}
      </SelectContent>
    </Select>
  );
}
