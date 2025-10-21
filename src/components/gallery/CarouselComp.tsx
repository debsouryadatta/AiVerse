"use client";
import Image from "next/image";
import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { CourseWithUser } from "@/types";

export function CarouselComp({ featuredCourses }: { featuredCourses: CourseWithUser[] }) {
  const cards = featuredCourses.map((course, index) => (
    <Card 
      key={course.id} 
      card={{
        id: course.id,
        category: "",
        title: course.title,
        src: course.image,
      }} 
      index={index} 
    />
  ));

  return (
    <div className="w-full h-full">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Featured Courses
      </h2>
      {cards.length > 0 ? (
        <Carousel items={cards} />
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No featured courses available yet.
        </div>
      )}
    </div>
  );
}
