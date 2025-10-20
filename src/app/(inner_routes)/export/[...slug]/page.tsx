"use client";

import { getFullCourseAction } from "./actions";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useTheme } from "next-themes";


type Props = {
  params: {
    slug: string[];
  };
};

export default function page({ params: { slug } }: Props) {
  const [fullCourse, setFullCourse] = useState<any>(null);

  const componentToExport = useRef<HTMLDivElement>(null);
  const { theme } = useTheme()

  const exportPDF = async () => {
    // Change theme to light mode for exporting
    if(theme === "dark") {
      toast.error("Change theme to light mode for exporting");
      return;
    }
    try {
      if (componentToExport.current) {
        const canvas = await html2canvas(componentToExport.current, {
          scale: 2, // Increase scale for better quality
          useCORS: true, // This might be necessary for loading images
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${fullCourse?.title}.pdf`);
      }
      toast.success("Course exported successfully");
    } catch (error) {
      console.log("Error", error);
      toast.error("Failed to export course");
    }
  };

  useEffect(() => {
    const getFullCourse = async () => {
      try {
        const res: any = await getFullCourseAction(slug[0]);
        setFullCourse(res);
        console.log("Full Course: ", res);
      } catch (error) {
        console.log("Error", error);
      }
    };

    getFullCourse();
  }, []);

  return (
    <div ref={componentToExport} className="mt-20 flex flex-col justify-center items-center">
      <Button onClick={exportPDF} className="my-4" variant={"outline"}>
        Export as PDF
      </Button>
      {/* COURSE DETAILS */}
      {fullCourse && (
        <div className="flex justify-center items-center w-[80vw] flex-col lg:flex-row">
          <div className="w-[500px] h-[300px] lg:mr-20">
            <Image
              src={fullCourse?.image}
              className="w-full h-full rounded-md object-cover"
              alt="cover image"
              width={300}
              height={300}
              layout="fixed"
              />
          </div>
            <div className="mt-5">
            <h1 className="text-4xl font-bold mb-2 text-center lg:text-start">Title: {fullCourse?.title}</h1>
            <h4 className="text-sm uppercase text-secondary-foreground/60">
              {fullCourse?.description}
            </h4>
            </div>
        </div>
      )}

      {/* CHAPTERS */}
      {fullCourse?.units.map((chapter: any, index: number) => {
        return (
          <div
            key={index + 1}
            className="flex flex-col justify-center items-center w-[80vw] mt-20"
          >
            <h4 className="text-sm uppercase text-secondary-foreground/60">
              Chapter: {index + 1}
            </h4>
            <h1 className="text-4xl font-bold">{chapter.title}</h1>
            <div className="mt-16">
              <h3 className="text-3xl font-semibold">Summary:</h3>
              <p className="mt-2 text-secondary-foreground/80">
                {chapter.summary}
              </p>
            </div>
            <div className="mt-16">
              <h3 className="text-3xl font-semibold">
                More about {chapter.title}:
              </h3>
              {chapter.subtopics.map((subtopic: any, index: number) => (
                <div key={index}>
                  <h3 className="mt-6 text-xl font-semibold">{subtopic}</h3>
                  <p className="mt-1 text-secondary-foreground/80">
                    {chapter.subtopicExplanations[index]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
