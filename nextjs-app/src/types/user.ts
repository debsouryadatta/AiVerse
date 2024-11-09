export interface User {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    bio: string | null;
    createdAt: Date;
    updatedAt: Date;
}