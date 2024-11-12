// "use client";

// import { deleteRoadmapAction, getBookmarkCoursesAction, getSavedRoadmapsAction } from "./actions";
// import { HoverEffect } from "@/components/ui/card-hover-effect";
// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { BookmarkCourse, Course } from "@/types";
// import { Roadmap, RoadmapModel } from "@/types/roadmap";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import RoadmapComp from "@/components/roadmap/RoadmapComp";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Trash2 } from "lucide-react";

// export default async function page() {
//   const [courses, setCourses] = useState<BookmarkCourse[]>([]);
//   const [roadmaps, setRoadmaps] = useState<any>([]);
//   const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
//   const session = useSession();
//   const router = useRouter();

//   if (!session?.data?.user) {
//     toast("You need to be logged in to see Profile.");
//     return router.push("/gallery");
//   }

//   useEffect(() => {
//     const fetchCourses = async () => {
//       let bookmarkCourses: BookmarkCourse[] = await getBookmarkCoursesAction(
//         session?.data?.user?.id!
//       );
//       console.log("bookmarkCourses", bookmarkCourses);
      
//       setCourses(bookmarkCourses);
//     };

//     const fetchRoadmaps = async () => {
//       let savedRoadmaps: RoadmapModel[] = await getSavedRoadmapsAction(
//         session?.data?.user?.id!
//       );
//       savedRoadmaps = savedRoadmaps.map((item) => {
//         return {
//           ...item,
//           roadmap: JSON.parse(item.roadmap as string) as Roadmap,
//         };
//       })
//       setRoadmaps(savedRoadmaps);
//     };
//     fetchCourses();
//     fetchRoadmaps();
//   }, []);


//   const deleteRoadmap = async (roadmapId: string) => {
//     try {
//       await deleteRoadmapAction(roadmapId);
//       setRoadmaps((prev: any) => prev.filter((item: any) => item.id !== roadmapId));
//       toast.success("Roadmap deleted successfully");
//     } catch (error) {
//       console.log("Error", error);
//       toast.error("Failed to delete roadmap");
//     }
//   }

//   return (
//     <div className="min-h-[75vh]">
//       <h2 className="text-center mt-20 mb-[-30px] text-2xl font-bold">
//         Bookmarked Courses
//       </h2>
//       {courses && courses.length > 0 ? (
//         <div className="mx-auto max-w-[70vw]">
//           <HoverEffect items={
//             courses.map((course) => {
//               return {
//                 id: course?.course?.id!,
//                 title: course?.course?.title!,
//                 image: course?.course?.image!,
//                 description: course?.course?.description!,
//                 user: course?.course?.user,
//                 bookmarkId: course.id,
//               };
//             })
//           } page="bookmark-page" setCourses={setCourses} />
//         </div>
//       ) : (
//         <div className="flex justify-center items-center h-96">
//           <h1 className="text-3xl">No bookmarks found</h1>
//         </div>
//       )}
//       <h2 className="text-center mt-20 mb-[-30px] text-2xl font-bold">
//         Saved Roadmaps
//       </h2>
//       {roadmaps && roadmaps.length > 0 ? (
//         <div className="container mx-auto p-4 my-10">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {roadmaps.map((roadmap: any) => (
//               <Dialog key={roadmap?.id}>
//                 <DialogTrigger asChild className="bg-gray-100 dark:bg-zinc-800 rounded-xl">
//                 <div className="relative group ">
//                 <Button
//                   variant="outline"
//                   className="w-full h-24 text-left flex flex-col items-start justify-center p-4 pr-12 dark:bg-zinc-800"
//                   onClick={() => setSelectedRoadmap(roadmap?.roadmap)}
//                 >
//                   <span className="font-semibold">{roadmap?.title}</span>
//                   <div className="flex">
//                     <span className="text-sm text-gray-500 mr-2">
//                       {roadmap?.roadmap?.topics.length} topics
//                     </span>
//                     <span className="text-sm text-gray-500">
//                       {roadmap?.roadmap?.topics.reduce((acc: number, topic: any) => acc + topic.subtopics.length, 0)} 
//                       subtopics
//                     </span>
//                   </div>
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="absolute top-2 right-2 dark:hover:bg-zinc-900"
//                   onClick={async() => await deleteRoadmap(roadmap.id)}
//                   aria-label={`Delete ${roadmap.title}`}
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//                 </DialogTrigger>
//                 <DialogContent className="max-w-7xl w-11/12 h-[90vh] bg-gray-100 dark:bg-zinc-800">
//                   <ScrollArea className="h-full">
//                     <RoadmapComp roadmap={selectedRoadmap} />
//                   </ScrollArea>
//                 </DialogContent>
//               </Dialog>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="flex justify-center items-center h-96">
//           <h1 className="text-3xl">No roadmaps found</h1>
//         </div>
//       )}
//     </div>
//   );
// }
