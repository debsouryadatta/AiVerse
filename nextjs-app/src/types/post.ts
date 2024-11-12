import { Bookmark, Comment, Like, User } from "@prisma/client";

export interface Post {
    id: string;
    userId: string;
    caption?: string | null;
    mediaUrl: string;
    mediaType: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ExplorePost extends Post {
    user: User;
    comments: Comment[];
    likes: Like[];
    bookmarks: Bookmark[];
}