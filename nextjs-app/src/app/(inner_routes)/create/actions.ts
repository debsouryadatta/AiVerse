"use server";

import { getPhotoUrl } from "@/lib/cloudinary";
import { prisma } from "@/lib/db";
import { Chapter } from "@/types";
import axios from "axios";
import { nanoid } from 'nanoid';

const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL as string;

export async function generateChapters(chapters: { id: number, title: string }[]) {
  let genChapters = [];
  try {
    for (const chapter of chapters) {
      let res: Chapter = (await axios.get(`${FASTAPI_BASE_URL}/generate/course/chapter/${chapter.title}`)).data;
      genChapters.push(res);
    }
    console.log("Generated Chapters", genChapters);
    return genChapters;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}



export async function generateCourse(chapters: { id: number, title: string }[], courseTitle: string, userId: string, imageUrl: string, visibility: string) {
  try {
    const userCredits = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        credits: true,
      },
    });
    if (!userCredits) {
      throw new Error("User not found");
    }
    if (userCredits.credits < 50 + (chapters.length - 1) * 25) {
      throw new Error("Not enough credits");
    }

    let generatedChapters: Chapter[] = await generateChapters(chapters);
    let description: string = (await axios.get(`${FASTAPI_BASE_URL}/generate/course/description/${courseTitle}`)).data;
    if (imageUrl === "") {
      imageUrl = (await axios.get(`${FASTAPI_BASE_URL}/generate/course/image/${courseTitle}`)).data;
    }
    let mcqs = (await axios.post(`${FASTAPI_BASE_URL}/generate/course/chapter/mcq`, { chapters: generatedChapters })).data;
    console.log("Generated mcqs: ---------------------------------------------------------", mcqs);

    let inviteCode = nanoid(10);


    const response = await prisma.course.create({
      data: {
        title: courseTitle,
        image: imageUrl,
        description: description,
        userId: userId,
        visibility: visibility,
        inviteCode: inviteCode,
        mcqs: mcqs
      }
    })
    const response2 = []

    for (const generatedChapter of generatedChapters) {
      response2.push(
        await prisma.chapter.create({
          data: {
            title: generatedChapter.title,
            courseId: String(response.id),
            subtopics: generatedChapter.subtopics,
            subtopicExplanations: generatedChapter.subtopicExplanations,
            youtubeSearchQuery: generatedChapter.youtubeSearchQuery,
            videoId: generatedChapter.videoId,
            summary: generatedChapter.summary
          }
        })
      )
    }

    // Decrement credits
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        credits: {
          decrement: 50 + (chapters.length - 1) * 25,
        },
      },
    });

    return { course: response, chapters: response2 }

  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}


export async function getPhotoUrlAction(formData: FormData) {
  try {
    // Convert the file to a buffer
    const file = formData.get("file") as File;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const photoUrl = await getPhotoUrl(buffer);
    console.log("Photo URL: ", photoUrl);
    return photoUrl;
  } catch (error) {
    throw error;
  }
}


export async function getUserCreditsAction(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    return user?.credits;
  } catch (error) {
    throw error;
  }
}


export async function createPostAction(userId: string, caption: string, mediaUrl: string, mediaType: string) {
  try {
    const post = await prisma.post.create({
      data: {
        userId,
        caption,
        mediaUrl,
        mediaType,
      },
    });
    return post;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}