import { CourseWithUser } from "./course";
import { ExplorePost } from "./post";

export interface Bookmark {
    id: string;
    userId: string;
    courseId: string | null;
    postId: string | null;
    createdAt: Date;
}

export interface BookmarkCourse {
    id: string;
    userId: string;
    courseId: string | null;
    postId: string | null;
    course: CourseWithUser | null;
    createdAt: Date;
}

export interface BookmarkPost {
    id: string;
    userId: string;
    courseId: string | null;
    postId: string | null;
    post: ExplorePost | null;
    createdAt: Date;
}