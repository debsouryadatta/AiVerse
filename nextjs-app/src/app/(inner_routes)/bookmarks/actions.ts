"use server";

import { prisma } from "@/lib/db";

export const getBookmarkCoursesAction = async (userId: string) => {
    try {
        const bookmarkCourses = await prisma.bookmark.findMany({
            where: {
                userId: userId
            },
            include: {
                course: {
                    include: {
                        user: true,
                    }
                }
            }
        })
        return bookmarkCourses;
    } catch (error) {
        console.log("Error", error);
        throw error;
    }
}

export const getSavedRoadmapsAction = async (userId: string) => {
    try {
        let savedRoadmaps = await prisma.roadmap.findMany({
            where: {
                userId: userId
            }
        })
        return savedRoadmaps;
    } catch (error) {
        console.log("Error", error);
        throw error;
    }
}

export const deleteBookmarkAction = async (bookmarkId: string) => {
    try {
        await prisma.bookmark.delete({
            where: {
                id: bookmarkId
            }
        })
        return true;
    } catch (error) {
        console.log("Error", error);
        throw error;
    }
}

export const deleteRoadmapAction = async (roadmapId: string) => {
    try {
        await prisma.roadmap.delete({
            where: {
                id: roadmapId
            }
        })
        return true;
    } catch (error) {
        console.log("Error", error);
        throw error;
    }
}