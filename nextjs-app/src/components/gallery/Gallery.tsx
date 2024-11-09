import { HoverEffect } from "../ui/card-hover-effect";

export function Gallery({courses}: {courses: { id: string, title: string, image: string, description: string, user: any }[] | undefined}) {
  return (
    <div className="w-full lg:w-[80vw] mx-auto px-8">
      <HoverEffect items={courses} />
    </div>
  );
}
