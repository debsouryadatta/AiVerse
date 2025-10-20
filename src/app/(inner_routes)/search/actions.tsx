"use server"

import { prisma } from "@/lib/db";


export async function searchCoursesAction(search: string){
    try {
        const result = await prisma.course.findMany({
            where: {
                title: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            include: {
                user: true
            }
        })
        console.log("Courses", result);
        return result;
    } catch (error) {
        console.log("Error", error);
        throw error;
    }
}

export async function searchProfilesAction(search: string){
    try {
        const result = await prisma.user.findMany({
            where: {
                name: {
                    contains: search,
                    mode: "insensitive"
                }
            }
        })
        console.log("Profiles", result);
        return result;
    } catch (error) {
        console.log("Error", error);
        throw error;
    }
}

export async function searchPostsAction(search: string){
    try {
        const result = await prisma.post.findMany({
            where: {
                caption: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            include: {
                user: true,
                comments: true,
                likes: true,
                bookmarks: true,
            }
        })
        console.log("Posts", result);
        return result;
    } catch (error) {
        console.log("Error", error);
        throw error;
    }
}