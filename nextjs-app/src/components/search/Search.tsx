"use client";

import { useCallback, useState } from "react";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import SearchTabs from "./SearchTabs";
import { debounce, set } from "lodash";
import { searchCoursesAction, searchProfilesAction } from "@/app/(inner_routes)/search/actions";
import { CourseWithUser, User } from "@/types";


export function Search() {
  const [searchInput, setSearchInput] = useState("");
  const [courses, setCourses] = useState<CourseWithUser[]>([]);
  const [profiles, setProfiles] = useState<User[]>([]);

  const placeholders = [
    "Artificial Intelligence",
    "Blockchain Development",
    "Algebra",
    "Data Structures and Algorithms",
    "Themo Dynamics",
  ];

  const handleChange = useCallback(
    debounce(async(e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);
      try {
        const courses: CourseWithUser[] = await searchCoursesAction(e.target.value);
        const profiles: User[]  = await searchProfilesAction(e.target.value);
        console.log("Courses", courses);
        console.log("Profiles", profiles);
        setCourses(courses);
        setProfiles(profiles);
      } catch (error) {
        console.log("Error", error);
      }
    }, 300),
    []
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="flex flex-col mt-20 px-4">
      <h2 className="text-lg md:text-xl font-bold text-neutral-800 dark:text-neutral-200 font-sans pl-3 mb-4">
        Search Courses & Profiles
      </h2>
      <div className="w-[300px] sm:w-[600px] lg:w-[900px]">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </div>
      <SearchTabs courses={courses} profiles={profiles} />
    </div>
  );
}
