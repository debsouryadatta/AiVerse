"use client";

import { BookmarkCourse } from '@/types';
import React, { useState } from 'react';
import { HoverEffect } from '../ui/card-hover-effect';
import { IconBookmark } from '@tabler/icons-react';
import { useProfileCoursesStore } from '@/store';
import { useProfilePostsStore } from '@/store/post';

export default function CoursesCreated() {
    const { courses, setCourses } = useProfileCoursesStore();
    const { posts, setPosts } = useProfilePostsStore();

  if (courses.length === 0) {
    return (
      <div className="flex items-center justify-center gap-1 my-20">
        <IconBookmark size={30} stroke={2} />
        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
          No Courses Created
        </h3>
      </div>
    )
  }

  return (
    <div className="min-h-[75vh]">
      {courses.length > 0 && (
        <div className="mx-auto">
        <h2 className="text-center mt-10 mb-[-30px] text-2xl font-bold">Courses Created</h2>
          <HoverEffect 
            items={courses} 
            page="profile-page"
            setProfileCourses={setCourses}
          />
        </div>
      )}
    </div>
  );
}
