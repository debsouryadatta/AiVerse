"use server";

import { auth } from "@/lib/auth";
import { getPhotoUrl } from "@/lib/cloudinary";
import { prisma } from "@/lib/db";

export async function getUserCoursesAction(userId: string) {
  try {
    const courses = await prisma.course.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
      },
    });
    return courses;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export async function getUserProfileAction(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    console.log("User", user);
    return user;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export async function getUserPostsAction(userId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
        comments: true,
        likes: true,
        bookmarks: true,
      },
    });
    return posts;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export async function followUserAction(
  followerId: string,
  followingId: string
) {
  try {
    const follow = await prisma.follow.create({
      data: {
        followerId: followerId,
        followingId: followingId,
      },
    });
    return true;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export async function unfollowUserAction(
  followerId: string,
  followingId: string
) {
  try {
    const follow = await prisma.follow.deleteMany({
      where: {
        followerId: followerId,
        followingId: followingId,
      },
    });
    return true;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export async function isUserAlreadyFollowedAction(
  followerId: string,
  followingId: string
) {
  try {
    const follow = await prisma.follow.findFirst({
      where: {
        followerId: followerId,
        followingId: followingId,
      },
    });
    if (follow) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export async function getFollowersAction(userId: string) {
  try {
    const followArr = await prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: true,
      },
    });
    const followers = followArr.map((follow) => follow.follower);
    return followers;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export async function getFollowingAction(userId: string) {
  try {
    const followArr = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: true,
      },
    });
    const following = followArr.map((follow) => follow.following);
    return following;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export async function deleteCoursesAction(
  deleteCourses: string[],
  userId: string
) {
  try {
    const deleteArr = await prisma.course.deleteMany({
      where: {
        id: {
          in: deleteCourses,
        },
        userId: userId,
      },
    });
    return true;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export async function deleteCourseAction(courseId: string) {
  const session = await auth();
  try {
    const course = await prisma.course.delete({
      where: {
        id: courseId,
        userId: session?.user?.id,
      },
    });
    return true;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

export async function getPhotoUrlAction(formData: FormData) {
  try {
    // Convert the file to a buffer
    const file = formData.get("file") as File;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const photoUrl = await getPhotoUrl(buffer);
    console.log("Photo URL: ", photoUrl);
    return photoUrl;
  } catch (error) {
    throw error;
  }
}

export async function updateProfileAction(
  profile: { name: string; bio: string; image: string },
  userId: string
) {
    try {
        const user = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            name: profile.name,
            bio: profile.bio,
            image: profile.image,
        },
        });
        return user;
    } catch (error) {
        console.log("Error", error);
        throw error;
    }
}

export async function deletePostAction(postId: string, userId: string) {
  try {
    const post = await prisma.post.delete({
      where: {
        id: postId,
        userId: userId,
      },
    });
    return true;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}
