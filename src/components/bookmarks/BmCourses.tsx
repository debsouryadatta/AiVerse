"use client";

import { BookmarkCourse } from '@/types';
import React, { useState } from 'react';
import { HoverEffect } from '../ui/card-hover-effect';
import { IconBookmark } from '@tabler/icons-react';

export default function BmCourses({bookmarkCourses, setBookmarkCourses}: {bookmarkCourses: BookmarkCourse[], setBookmarkCourses: React.Dispatch<React.SetStateAction<BookmarkCourse[]>>}) {

  if (bookmarkCourses.length === 0) {
    return (
      <div className="flex items-center justify-center gap-1 my-20">
        <IconBookmark size={30} stroke={2} />
        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
          No bookmarks yet
        </h3>
      </div>
    )
  }

  return (
    <div className="min-h-[75vh]">
      {bookmarkCourses.length > 0 && (
        <div className="mx-auto">
          <HoverEffect 
            items={bookmarkCourses.map(course => ({
              id: course.course!.id,
              title: course.course!.title,
              image: course.course!.image,
              description: course.course!.description,
              user: course.course?.user,
              bookmarkId: course.id
            }))} 
            page="bookmark-page"
            setCourses={setBookmarkCourses}
          />
        </div>
      )}
    </div>
  );
}
