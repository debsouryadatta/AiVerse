"use server";

import { getVoiceChatResponse } from "@/lib/generate";
import { prisma } from "@/lib/db";
import axios from "axios";

const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL as string;

export const transcript = async (prevState: any, formData: FormData) => {
  const messages = JSON.parse(formData.get("messages") as string);
  const voiceMentorDescription = formData.get("voiceMentorDescription") as string;
  const file = formData.get("audio") as File;
  if (file.size === 0) {
    return {
      sender: "",
      response: "No audio file provided",
    };
  }
  console.log(">>", file);


  // const { response, input } = await getVoiceChatResponse(messages, file, voiceMentorDescription);
  const { response, input} = (await axios.post(`${FASTAPI_BASE_URL}/get/voice_chat_response`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })).data;

  const id = Math.random().toString(36);
  return {
    sender: input,
    response: response,
    id: id,
  };
}

export const reduceCredits = async (userId: string) => {
  try {
    // Calculate credits to reduce (0.5 credits per second, for 10 seconds)
    const creditsToReduce = 0.5 * 10; // 5 credits per call

    // Get current user credits
    const userCredits = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    });

    if (!userCredits) {
      throw new Error("User not found");
    }

    if (userCredits.credits < creditsToReduce) {
      throw new Error("Insufficient credits");
    }

    // Update user credits
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: creditsToReduce
        }
      }
    });

    return {
      success: true,
      remainingCredits: updatedUser.credits
    };
  } catch (error) {
    console.error("Error reducing credits:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reduce credits"
    };
  }
};