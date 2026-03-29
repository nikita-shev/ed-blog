import { inject, injectable } from 'inversify';
import { CommentsRepository } from '../repositories/comment.repository';
import { CommentModel } from '../schema/schema';
import {
    createdResult,
    forbiddenResult,
    noContentResult,
    notFoundResult,
    successResult
} from '../../../core/utils/result-object';
import { mapCommentData } from '../routers/mappers/mapCommentData';
import { ServiceDto } from '../../../core/utils/result-object/types/result-object.types';
import { CommentInputDto, CommentOutputDto } from '../dto/comment.dto';
import { CommentatorInfo } from '../types/comments.types';

@injectable()
export class CommentsService {
    constructor(@inject(CommentsRepository) private commentRepository: CommentsRepository) {}

    async getCommentById(id: string): Promise<ServiceDto<CommentOutputDto | null>> {
        const comment = await this.commentRepository.getCommentById(id);

        return comment ? successResult.create(mapCommentData(comment)) : notFoundResult.create();
    }

    async createComment(
        postId: string,
        data: { content: string; commentatorInfo: CommentatorInfo }
    ): Promise<ServiceDto<CommentOutputDto | null>> {
        const newComment = new CommentModel({
            postId,
            content: data.content,
            commentatorInfo: data.commentatorInfo,
            createdAt: new Date().toISOString()
        });
        await this.commentRepository.save(newComment);
        const result = await this.getCommentById(newComment.id);

        return result.data ? createdResult.create(result.data) : result;
    }

    async updateComment(
        userId: string,
        commentId: string,
        content: CommentInputDto
    ): Promise<ServiceDto<boolean | null>> {
        const comment = await this.commentRepository.getCommentById(commentId);

        if (!comment) return notFoundResult.create();
        if (comment && comment.commentatorInfo.userId !== userId) return forbiddenResult.create();

        comment.content = content.content;
        await this.commentRepository.save(comment);

        return noContentResult.create(true);
    }

    async deleteComment(userId: string, commentId: string): Promise<ServiceDto<boolean | null>> {
        const comment = await this.commentRepository.getCommentById(commentId);

        if (!comment) return notFoundResult.create(null);
        if (comment && comment.commentatorInfo.userId !== userId)
            return forbiddenResult.create(null);

        const result = await this.commentRepository.deleteComment(commentId);

        return noContentResult.create(result);
    }
}
