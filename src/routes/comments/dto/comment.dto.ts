import { CommentatorInfo } from '../types/comments.types';

export interface CommentOutputDto {
    id: string;
    content: string;
    commentatorInfo: CommentatorInfo;
    createdAt: string;
}
