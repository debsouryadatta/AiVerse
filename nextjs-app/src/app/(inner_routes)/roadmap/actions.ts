"use server";

import { prisma } from "@/lib/db";
import { Roadmap } from "@/types/roadmap";
import axios from "axios";

const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL as string;

export const generateRoadmapAction = async (roadmapTitle: string, isPro: boolean, userId: string) => {
    try {
        let response = (await axios.get(`${FASTAPI_BASE_URL}/generate/roadmap/${roadmapTitle}`)).data;
        // Decrement credits
        if(!isPro){
            await prisma.user.update({
                where: {
                  id: userId,
                },
                data: {
                  credits: {
                    decrement: 1,
                  },
                },
            });
        }
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