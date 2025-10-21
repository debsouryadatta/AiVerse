import { Gallery } from "@/components/gallery/Gallery";
import { CarouselComp } from "@/components/gallery/CarouselComp";
import { CourseWithUser } from "@/types";



export default function GalleryTab({courses, featuredCourses}: {courses: CourseWithUser[], featuredCourses: CourseWithUser[]}) {
  return (
    <div className="mt-20 min-h-[75vh] w-[90vw]">
      <CarouselComp featuredCourses={featuredCourses} />
      {courses?.length === 0 && <h1 className="mt-52 text-center text-2xl font-bold">No Courses Available!</h1>}
      <Gallery courses={courses} />
    </div>
  )
}

export const dynamic = 'force-dynamic';