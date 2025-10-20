// "use client";

import { ImageComp } from "@/components/course/ImageComp";
import { SelectChapter } from "@/components/course/SelectChapter";
import { checkCourseAccessAction, getCourseDetails } from "./actions";
import ChapterComp from "@/components/course/ChapterComp";
import { auth } from "@/lib/auth";

type Props = {
  params: {
    slug: string[];
  };
  searchParams: { [key: string]: string | undefined };
};

export default async function page({ params: { slug }, searchParams }: Props) {

  console.log("Slug: ", slug);
  const courseId = slug[0];
  const chapterId = slug[1];
  const inviteCode = searchParams.inviteCode ?? null;
  const session = await auth();

  const courseDetails = await getCourseDetails(courseId);
  console.log("Course Details: ", courseDetails);

  if(!courseDetails || courseDetails.length == 0) {
    return <div className="h-[60vh] w-[93vw] flex justify-center items-center text-3xl">Course not found!</div>
  }

  const { access, reason } = await checkCourseAccessAction(courseId, inviteCode!, session?.user?.id!);
  if (!access) {
    return <div className="flex justify-center items-center h-[80vh] text-xl">Access denied: {reason}</div>;
  }


  return (
    <div className="mt-20 flex flex-col justify-center items-center">
      <SelectChapter courseDetails={courseDetails} />
      <div className="mt-10 mb-20">

      {slug?.length === 1 && (
        <ImageComp course={courseDetails && courseDetails[0].course} firstChapterId={courseDetails && courseDetails[0].id} />
      )}

      {slug?.length > 1 && (
        <div>
          <ChapterComp
            courseDetails={courseDetails}
            chapterId={chapterId}
          />
        </div>
      )}
      </div>
    </div>
  );
}
