import { Gallery } from "@/components/gallery/Gallery";
import { CarouselComp } from "@/components/gallery/CarouselComp";
import { prisma } from "@/lib/db";

async function getCourses(){
  try {
    const res = await prisma.course.findMany({
      where: {
        visibility: "public"
      },
      include: {
        user: true,
      }
    });
    return res;
  } catch (error) {
    console.log("Error: ", error);
  }

}

export default async function GalleryTab() {
  const courses = await getCourses();
  console.log("Courses: ", courses);
  
  return (
    <div className="mt-20 min-h-[75vh] w-[90vw]">
      <CarouselComp />
      {courses?.length === 0 && <h1 className="mt-52 text-center text-2xl font-bold">No Courses Available!</h1>}
      <Gallery courses={courses} />
    </div>
  )
}

export const dynamic = 'force-dynamic';