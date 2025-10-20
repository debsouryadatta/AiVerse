"use server";

import { prisma } from "@/lib/db";

export const getVoiceMentorsAction = async (userId: string) => {
    try {
        const voicementors = await prisma.voiceMentor.findMany({
            where: {
                userId: userId
            }
        });
        return voicementors;
    } catch (error) {
        console.log("Error", error);
        throw error;
    }
}

export const createVoiceMentorAction = async (name: string, description: string, voiceId: string, userId: string) => {
    try {
        const voicementor = await prisma.voiceMentor.create({
            data: {
                name,
                description,
                voiceId,
                chatHistory: [],
                userId
            }
        });
        return voicementor;
    } catch (error) {
        console.log("Error", error);
        throw error;
    }
}

export const deleteVoiceMentorAction = async (id: string, userId: string) => {
    try {
        const voicementor = await prisma.voiceMentor.delete({
            where: {
                id,
                userId
            }
        });
        return voicementor;
    } catch (error) {
        console.log("Error", error);
        throw error;
    }
}

export const getVoiceMentorDetailsAction = async (id: string, userId: string) => {
    try {
        const voicementor = await prisma.voiceMentor.findUnique({
            where: {
                id,
                userId
            }
        });
        return voicementor;
    } catch (error) {
        console.log("Error", error);
        throw error;
    }
}

export const updateVoiceMentorDetailsAction = async (id: string, userId: string, data: any) => {
    try {
        const voicementor = await prisma.voiceMentor.update({
            where: {
                id,
                userId
            },
            data
        });
        return voicementor;
    } catch (error) {
        console.log("Error", error);
        throw error;
    }
}