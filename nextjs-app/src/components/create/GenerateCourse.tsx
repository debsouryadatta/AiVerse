"use client";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/utils/cn";
import { InfoIcon, Loader2, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { checkSubscriptionAction, generateCourse, getPhotoUrlAction, getUserCreditsAction } from "@/app/(inner_routes)/create/actions";
import { useRouter } from "next/navigation";
import { FileUpload } from "../ui/file-upload";
import { Switch } from "@/components/ui/switch";
import SubscriptionAction from "./SubscriptionAction";
import { useSession } from "next-auth/react";

export function GenerateCourse() {
  const [courseTitle, setCourseTitle] = useState("");
  const [chapters, setChapters] = useState([{ id: 1, title: "" }]);
  const [files, setFiles] = useState<File[]>([]);
  const [generateImage, setGenerateImage] = useState(false);
  const [visibility, setVisibility] = useState("public");
  const [bannerUrl, setBannerUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const [credits, setCredits] = useState(0);
  const [isPro, setIsPro] = useState(false);

  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    const getUserCredits = async () => {
      try {
        const credits = await getUserCreditsAction(session?.data?.user?.id!);
        setCredits(credits!);
      } catch (error) {
        console.log("Error", error);
        toast.error("Error getting user credits");
      }
    };
    const checkPro = async () => {
      try {
        const isPro = await checkSubscriptionAction(session?.data?.user?.id!);
        console.log("Is Pro", isPro);
        setIsPro(isPro);
      } catch (error) {
        console.log("Error", error);
      }
    }
    getUserCredits();
    checkPro();
  }, [session]);
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast("Generating course...");
    setGenerating(true);
    if (!courseTitle) return toast("Course title is required.");
    for (const chapter of chapters) {
      if (!chapter.title) {
        return toast("Chapter title is required.");
      }
    }
    if(isPro === false && credits === 0) {
      setGenerating(false);
      return toast.error("You have reached your free generation limit. Please upgrade to generate more courses");
    }
    try {
      const course = await generateCourse(chapters, courseTitle, session?.data?.user?.id!, bannerUrl, visibility, isPro);
      console.log("Generated Course", course);
      if(course.chapters.length === 0) {
        throw Error;
      }
      setGenerating(false);
      toast.success("Course has been generated successfully.");
      router.push(`/gallery`);
    } catch (error) {
      console.log("Error", error);
      setGenerating(false);
      toast.error("An error occured generating the course. Please try again.");
    }
  };

  const addMoreChapters = () => {
    console.log("Adding more chapters");
    const newChapter = { id: chapters.length + 1, title: "" };
    setChapters([...chapters, newChapter]);
    toast("Chapter box has been added.");
    console.log([...chapters, newChapter]);
  };

  const removeChapters = () => {
    console.log("Removing chapters");
    if (chapters.length === 1) {
      return toast("At least one chapter is required.");
    }
    setChapters(chapters.slice(0, -1));
    toast("Chapter box has been removed.");
  };

  const renderChapters = () => {
    return chapters.map((chapter, index) => (
      <LabelInputContainer key={index} className="mb-4">
        <Input
          className=""
          id={`chapter-${chapter.id}`}
          placeholder="Chapter Title"
          type="text"
          value={chapter.title}
          onChange={(e) => {
            setChapters([
              ...chapters.map((chap) =>
                chap.id === chapter.id
                  ? { ...chap, title: e.target.value }
                  : chap
              ),
            ]);
          }}
        />
      </LabelInputContainer>
    ));
  };

  const handleFileUpload = async (files: File[]) => {
    setFiles(files);
    console.log(files);

    try {
      // Get the photo URL from cloudinary
      const formData = new FormData();
      formData.append("file", files[0]);
      const photoUrl = await getPhotoUrlAction(formData);
      console.log("Photo URL: ", photoUrl);
      toast.success("Photo uploaded successfully");

      setBannerUrl(photoUrl);
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload photo");
    }
  }

  return (
    <div className="max-w-3xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-zinc-950">
      <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
        Generate Course
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Unveil The Power of AI in Education
      </p>
      <div className="flex p-4 mt-5 border-none bg-zinc-200 dark:bg-zinc-800 rounded-md">
        <InfoIcon className="w-12 h-12 mr-3 text-blue-400" />
        <div>
          Enter in a course title, or what you want to learn about. Then enter a
          list of units, which are the specifics you want to learn. And our AI
          will generate a course for you!
        </div>
      </div>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label className="text-lg">Course Title</Label>
          <Input
            name="courseTitle"
            id="email"
            placeholder="Artificial Intelligence"
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
          />
        </LabelInputContainer>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <LabelInputContainer className="mb-4">
          <Label className="text-lg">Chapter Title</Label>
        </LabelInputContainer>

        {renderChapters()}

        <div className="flex justify-center items-center">
          <div
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] mb-10 flex items-center justify-center cursor-pointer mr-4"
            onClick={addMoreChapters}
          >
            Add more <Plus size={17} />
            <BottomGradient />
          </div>
          <div
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] mb-10 flex items-center justify-center cursor-pointer"
            onClick={removeChapters}
          >
            <span>Delete</span>
            <Trash size={15} className="ml-[0.5px] mt-[-3px]" />
            <BottomGradient />
          </div>
        </div>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <LabelInputContainer className="mb-4">
          <Label className="text-lg">Upload Course Banner</Label>
        </LabelInputContainer>

        <div className="flex justify-end items-center mb-4">
          <Switch checked={generateImage} onCheckedChange={() => {
            setGenerateImage(!generateImage)
            // console.log(generateImage);
          }}  />
          <span className="ml-2">Generate with Unsplash</span>
        </div>

        <div className="w-full mx-auto border border-dashed bg-gray-300 dark:bg-zinc-950 border-neutral-200 dark:border-neutral-800 rounded-lg mb-8">
        <FileUpload onChange={handleFileUpload} />
      </div>



      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />


      <div className="mb-20 flex items-center">
      <LabelInputContainer>
        <Label className="text-lg">Visibility</Label>
      </LabelInputContainer>
      <div className="px-2 dark:bg-zinc-900 rounded-md cursor-pointer">
        <select defaultValue={"public"} className="rounded-md p-2 dark:bg-zinc-900 focus:outline-none cursor-pointer" name="Select Visibility" id=""
        onChange={(e) => setVisibility(e.target.value)}
        >
          <option value="public">Public</option>
          <option value="invite-only">Invite Only</option>
        </select>
      </div>
      </div>




        {generating ? (
          <button
            className="opacity-70 cursor-pointer bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            disabled={true}
          >
            <div className="flex justify-center items-center">
              <span>Generating...</span>
              <span><Loader2 className="animate-spin w-5 h-5 ml-1" /></span>
            </div>
            <BottomGradient />
          </button>
        ) : (
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            disabled={false}
          >
            Generate &rarr;
            <BottomGradient />
          </button>
        )}

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>

      {!isPro && <SubscriptionAction credits={credits} /> }
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
