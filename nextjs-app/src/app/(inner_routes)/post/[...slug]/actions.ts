"use server";

import { prisma } from "@/lib/db";

export const getPostDetailsAction = async (postId: string) => {
    try {
        const res = await prisma.post.findUnique({
        where: {
            id: postId
        },
        include: {
            user: true,
            comments: true,
            likes: true,
            bookmarks: true,
        }
        })
        return res;
    } catch (error) {
        console.log(error);
    }
}

export const addCommentAction = async (userId: string, postId: string, text: string) => {
  try {    
    const res = await prisma.comment.create({
      data: {
        userId: userId,
        postId: postId,
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

export const getCommentsAction = async (postId: string) => {
  try {
    const res = await prisma.comment.findMany({
      where: {
        postId: postId
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

export const addToBookmarkAction = async (userId: string, postId: string) => {
  try {
    const res = await prisma.bookmark.create({
      data: {
        userId: userId,
        postId: postId
      }
    })
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export const removeFromBookmarkAction = async (userId: string, postId: string) => {
  try {
    const res = await prisma.bookmark.deleteMany({
      where: {
        userId: userId,
        postId: postId
      }
    })
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export const addLikeAction = async (userId: string, postId: string) => {
  try {
    const res = await prisma.like.create({
      data: {
        userId: userId,
        postId: postId
      }
    })
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export const removeLikeAction = async (userId: string, postId: string) => {
  try {
    const res = await prisma.like.deleteMany({
      where: {
        userId: userId,
        postId: postId
      }
    })
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export const checkLikeBookmarkStatusAction = async (userId: string, postId: string) => {  
  try {
    if(!userId || !postId) return {bookmark: null, like: null};
    const bookmark = await prisma.bookmark.findFirst({
      where: {
        userId: userId,
        postId: postId
      }
    })
    const like = await prisma.like.findFirst({
      where: {
        userId: userId,
        postId: postId
      }
    })
    return {bookmark, like};
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export const getLikesCountAction = async (postId: string) => {
  try {
    const res = await prisma.like.count({
      where: {
        postId: postId
      }
    })
    return res;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}
