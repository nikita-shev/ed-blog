import { CommentatorInfo } from '../types/comments.types';

export interface CommentInputDto {
    content: string;
}

export interface CommentOutputDto {
    id: string;
    content: string;
    commentatorInfo: CommentatorInfo;
    createdAt: string;
}
