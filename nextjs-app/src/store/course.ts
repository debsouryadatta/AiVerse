import { CourseWithUser, User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CoursesState {
  courses: CourseWithUser[];
  setCourses: (courses: CourseWithUser[]) => void; // New function
  clearCourses: () => void;
}

interface DeleteCoursesState {
  deleteCourses: string[];
  setDeleteCourses: (deleteCourses: string[]) => void; // New function
  clearDeleteCourses: () => void;
}

export const useProfileCoursesStore = create<CoursesState>()(
  persist(
    (set) => ({
      courses: [],
      setCourses: (courses) => set({ courses }), // New function
      clearCourses: () => set({ courses: [] }),
    }),
    {
      name: "profile-courses-storage",
    }
  )
);


export const useProfileDeleteCoursesStore = create<DeleteCoursesState>()(
    persist(
      (set) => ({
        deleteCourses: [],
        setDeleteCourses: (deleteCourses) => set({ deleteCourses }), // New function
        clearDeleteCourses: () => set({ deleteCourses: [] }),
      }),
      {
        name: "profile-delete-courses-storage",
      }
    )
  );