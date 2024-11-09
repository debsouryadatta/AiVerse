"use server";

import { prisma } from "@/lib/db";

export async function getCourseDetails(courseId: string) {
    try {
      const res = await prisma.chapter.findMany({
        where: {
          courseId: courseId,
        },
        select: {
          course: true,
          id: true,
          courseId: true,
          title: true,
          subtopics: true,
          subtopicExplanations: true,
          youtubeSearchQuery: true,
          videoId: true,
          summary: true,
        },
      });
      return res;
    } catch (error) {
      console.log("Error: ", error);
    }
  }

export const getAuthorDetails = async (userId: string) => {
  try {
    const res = await prisma.user.findUnique({
      where: {
        id: userId,
      }
    })
    return res;
  } catch (error) {
    console.log("Error", error);
  }
}



export const addToBookmarkAction = async (userId: string, courseId: string) => {
  try {
    const res = await prisma.bookmark.create({
      data: {
        userId: userId,
        courseId: courseId
      }
    })
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export const removeFromBookmarkAction = async (userId: string, courseId: string) => {
  try {
    const res = await prisma.bookmark.deleteMany({
      where: {
        userId: userId,
        courseId: courseId
      }
    })
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export const addLikeAction = async (userId: string, courseId: string) => {
  try {
    const res = await prisma.like.create({
      data: {
        userId: userId,
        courseId: courseId
      }
    })
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export const removeLikeAction = async (userId: string, courseId: string) => {
  try {
    const res = await prisma.like.deleteMany({
      where: {
        userId: userId,
        courseId: courseId
      }
    })
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export const checkLikeBookmarkStatusAction = async (userId: string, courseId: string) => {  
  try {
    if(!userId || !courseId) return {bookmark: null, like: null};
    const bookmark = await prisma.bookmark.findFirst({
      where: {
        userId: userId,
        courseId: courseId
      }
    })
    const like = await prisma.like.findFirst({
      where: {
        userId: userId,
        courseId: courseId
      }
    })
    return {bookmark, like};
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export const getLikesCountAction = async (courseId: string) => {
  try {
    const res = await prisma.like.count({
      where: {
        courseId: courseId
      }
    })
    return res;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export const addCommentAction = async (userId: string, courseId: string, text: string) => {
  try {    
    const res = await prisma.comment.create({
      data: {
        userId: userId,
        courseId: courseId,
        text: text
      }
    })
    return res;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export const deleteCommentAction = async (commentId: string) => {
  try {
    const res = await prisma.comment.delete({
      where: {
        id: commentId
      }
    })
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export const getCommentsAction = async (courseId: string) => {
  try {
    const res = await prisma.comment.findMany({
      where: {
        courseId: courseId
      },
      include: {
        user: true,
      }
    })
    return res;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export const checkCourseAccessAction = async (courseId: string, inviteCode: string, userId: string) => {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId
      }
    })
    if(course?.visibility === 'public') {
      return {access: true};
    } else if(course?.inviteCode === inviteCode || course?.userId === userId) {
      return {access: true};
    } else {
      return {access: false, reason: "Invalid invite code or Access denied"};
    }
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export const changeVisibilityAction = async (courseId: string, userId: string, visibility: string) => {
  try {
    const res = await prisma.course.update({
      where: {
        id: courseId,
        userId: userId
      },
      data: {
        visibility: visibility
      }
    })
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}