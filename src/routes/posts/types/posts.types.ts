import { WithId } from 'mongodb';

export interface Post {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
}

export type PostWithId = WithId<Post>;
