'use server';

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateCourseQuiz } from "@/lib/generate";

// Generate quiz from course
export async function generateCourseQuizAction(courseId: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get user ID from email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, credits: true }
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Calculate credits required based on difficulty
    const creditsRequired = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;

    // Check if user has enough credits
    if (user.credits < creditsRequired) {
      return { success: false, error: `Not enough credits. Required: ${creditsRequired}, Available: ${user.credits}` };
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { units: true }
    });

    if (!course) {
      return { success: false, error: 'Course not found' };
    }

    const content = course.units.slice(0, 3).map((unit: any) =>
      `${unit.title}: ${unit.subtopics.join(', ')}`
    ).join('\n');

    const questions = await generateCourseQuiz(course.title, content, difficulty);

    // Deduct credits after successful quiz generation
    await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: {
          decrement: creditsRequired
        }
      }
    });

    return {
      success: true,
      questions,
      courseTitle: course.title,
      creditsUsed: creditsRequired
    };
  } catch (error) {
    console.error('Quiz generation error:', error);
    return { success: false, error: 'Failed to generate quiz' };
  }
}

// Save game score
export async function saveGameScore(data: {
  quizType: string;
  courseId?: string;
  score: number;
  totalQuestions?: number;
  correctAnswers?: number;
  timeSpent?: number;
  difficulty: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    await prisma.gameScore.create({
      data: {
        userId: user.id,
        quizType: data.quizType,
        courseId: data.courseId,
        score: data.score,
        totalQuestions: data.totalQuestions,
        correctAnswers: data.correctAnswers,
        timeSpent: data.timeSpent,
        difficulty: data.difficulty
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Save score error:', error);
    return { success: false, error: 'Failed to save score' };
  }
}

// Get user courses
export async function getUserCourses() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const courses = await prisma.course.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        title: true,
        image: true,
        units: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, courses };
  } catch (error) {
    console.error('Get courses error:', error);
    return { success: false, error: 'Failed to get courses' };
  }
}
