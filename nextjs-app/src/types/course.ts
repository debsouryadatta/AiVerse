
export interface CourseWithUser {
  id: string;
  title: string;
  image: string;
  description: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface Course {
  id: string;
  title: string;
  image: string;
  description: string;
  userId: string;
  visibility: string;
  inviteCode?: string | null;
  mcqs?: any | null;
}

export interface BookmarkCourse {
  id: string;
  userId: string;
  courseId: string | null;
  postId: string | null;
  course: CourseWithUser | null;
  createdAt: Date;
}
