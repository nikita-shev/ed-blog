import { WithId } from 'mongodb';

export interface CommentatorInfo {
    userId: string;
    userLogin: string;
}

export interface Comment {
    content: string;
    commentatorInfo: CommentatorInfo;
    postId: string;
    createdAt: string;
}
export type IComment = Comment; // TODO: временно

export type CommentWithId = WithId<Comment>;
