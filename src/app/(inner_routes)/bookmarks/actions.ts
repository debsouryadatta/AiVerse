"use server";

import { prisma } from "@/lib/db";

export const getBookmarkCoursesAction = async (userId: string) => {
    try {
        const bookmarkCourses = await prisma.bookmark.findMany({
            where: {
                userId: userId,
                postId: null
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

export const getBookmarkPostsAction = async (userId: string) => {
    try {
        const bookmarkPosts = await prisma.bookmark.findMany({
            where: {
                userId: userId,
                courseId: null
            },
            include: {
                post: {
                    include: {
                        user: true,
                        comments: true,
                        likes: true,
                        bookmarks: true
                    }
                }
            }
        })
        return bookmarkPosts;
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
