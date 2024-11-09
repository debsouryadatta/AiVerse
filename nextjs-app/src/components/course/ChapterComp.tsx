import McqCards from "./McqCards";

type Props = {
  courseDetails: any;
  chapterId: string;
};

export default function ChapterComp({ courseDetails, chapterId }: Props) {
  const chapter = courseDetails.find(
    (chapter: any) => chapter.id === chapterId
  );

  const chapterIndex = courseDetails.findIndex(
    (chapter: any) => chapter.id === chapterId
  );

  return (
    <>
      <div className="flex flex-col justify-center items-center mt-16 mx-8 sm:mx-20">
        <h4 className="text-sm uppercase text-secondary-foreground/60">
          Chapter: {chapterIndex + 1}
        </h4>
        <h1 className="text-4xl font-bold">{chapter.title}</h1>
        <iframe
          title="chapter video"
          className="w-full mt-4 aspect-video max-h-[30rem]"
          src={`https://www.youtube.com/embed/${chapter.videoId}`}
          allowFullScreen
        />
        <div className="mt-16">
          <h3 className="text-3xl font-semibold">Summary:</h3>
          <p className="mt-2 text-secondary-foreground/80">{chapter.summary}</p>
        </div>
        <div className="mt-16">
          <h3 className="text-3xl font-semibold">
            More about {chapter.title}:
          </h3>
          {chapter.subtopics.map((subtopic: any, index: number) => (
            <>
              <h3 className="mt-6 text-xl font-semibold">{subtopic}</h3>
              <p className="mt-1 text-secondary-foreground/80">
                {chapter.subtopicExplanations[index]}
              </p>
            </>
          ))}
        </div>
      </div>
      <div className="mt-20 mx-8 sm:mx-20">

        {
          courseDetails[chapterIndex].course.mcqs ? 
            <>
          <h3 className="text-3xl font-semibold">
            Concept Check: {chapter.title}
          </h3>
             <McqCards mcqs={courseDetails[chapterIndex].course.mcqs[chapterIndex]} />
            </>
          : null
        }
        {/* <McqCards mcqs={courseDetails[chapterIndex].course.mcqs[chapterIndex]} /> */}
      </div>
    </>
  );
}
