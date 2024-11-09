"use server";

import { prisma } from "@/lib/db";

export const getFullCourseAction = async (courseId: string) => {
    try {
        const res = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
            include: {
                units: true,
            }
        })
        return res;
    } catch (error) {
        console.log("Error", error);
        throw error;
    }
}