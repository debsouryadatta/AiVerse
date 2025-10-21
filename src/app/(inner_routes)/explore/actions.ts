'use server';

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// ==================== EXPLORE PAGE ACTIONS ====================

export async function getAllPosts() {
  try {
    const res = await prisma.post.findMany({
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
    return [];
  }
}

export async function getCourses() {
  try {
    const res = await prisma.course.findMany({
      where: {
        visibility: "public"
      },
      include: {
        user: true,
      }
    });
    return res;
  } catch (error) {
    console.log("Error: ", error);
    return [];
  }
}

export async function getFeaturedCourses() {
  try {
    const res = await prisma.course.findMany({
      where: {
        visibility: "public",
        featured: true
      },
      include: {
        user: true,
      }
    });
    return res;
  } catch (error) {
    console.log("Error fetching featured courses: ", error);
    return [];
  }
}

// ==================== GAME ACTIONS ====================

export async function getLeaderboard(quizType: string, limit = 10) {
  try {
    const scores = await prisma.gameScore.findMany({
      where: { quizType },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      },
      orderBy: { score: 'desc' },
      take: 100
    });

    const userBest = new Map();
    scores.forEach((s: any) => {
      if (!userBest.has(s.userId) || s.score > userBest.get(s.userId).score) {
        userBest.set(s.userId, s);
      }
    });

    const leaderboard = Array.from(userBest.values())
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, limit)
      .map((s: any, i: number) => ({
        rank: i + 1,
        name: s.user.name || 'Anonymous',
        image: s.user.image,
        score: s.score,
        correctAnswers: s.correctAnswers,
        totalQuestions: s.totalQuestions
      }));

    return { success: true, leaderboard };
  } catch (error) {
    console.error('Leaderboard error:', error);
    return { success: false, error: 'Failed to get leaderboard' };
  }
}