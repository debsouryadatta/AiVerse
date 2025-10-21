"use server";

import { prisma } from "@/lib/db";
import { Roadmap } from "@/types/roadmap";
import { generateRoadmap } from "@/lib/generate";
import { revalidatePath } from "next/cache";

export const generateRoadmapAction = async (roadmapTitle: string, userId: string) => {
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
        if (userCredits.credits < 25) {
          throw new Error("Not enough credits");
        }
        let response = await generateRoadmap(roadmapTitle);
        // Decrement credits
          await prisma.user.update({
              where: {
                id: userId,
              },
              data: {
                credits: {
                  decrement: 25,
                },
              },
          });
        return response;
    } catch (error) {
        console.log("Error", error);
        throw error;
    }
}

export const saveRoadmapAction = async (roadmap: Roadmap, userId: string) => {
  try {
    const roadmapJson = JSON.stringify(roadmap); // Convert Roadmap to JSON-compatible format
    const response = await prisma.roadmap.create({
      data: {
        userId: userId,
        title: roadmap.title,
        roadmap: roadmapJson,
      }
    })
    return true;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export const getSavedRoadmapsAction = async (userId: string) => {
  try {
    const savedRoadmaps = await prisma.roadmap.findMany({
      where: {
        userId: userId
      },
      // orderBy: {
      //   createdAt: 'desc'
      // }
    })
    return savedRoadmaps;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export const deleteSavedRoadmapAction = async (roadmapId: string, userId: string) => {
  try {
    const roadmap = await prisma.roadmap.delete({
      where: {
        id: roadmapId,
        userId: userId
      },
    });
    return true;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}