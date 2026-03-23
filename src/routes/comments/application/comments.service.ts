import { inject, injectable } from 'inversify';
import { CommentRepository } from '../repositories/comment.repository';
import { convertCommentData } from '../routers/mappers/mapToCommentOutput';
import {
    forbiddenResult,
    noContentResult,
    notFoundResult,
    successResult
} from '../../../core/utils/result-object';
import { NullableServiceDto } from '../../../core/utils/result-object/types/result-object.types';
import { CommentInputDto, CommentOutputDto } from '../dto/comment.dto';

@injectable()
export class CommentsService {
    constructor(@inject(CommentRepository) private commentRepository: CommentRepository) {}

    async getCommentById(id: string): NullableServiceDto<CommentOutputDto> {
        const foundComment = await this.commentRepository.getCommentById(id);

        if (!foundComment) {
            // return createResultObject(null, ResultStatus.NotFound);
            return notFoundResult.create();
        }

        // return createResultObject(convertCommentData(result.data));
        return successResult.create(convertCommentData(foundComment));
    }

    async updateComment(
        userID: string,
        commentId: string,
        content: CommentInputDto
    ): NullableServiceDto<boolean> {
        const result = await this.getCommentById(commentId); // TODO: так можно?

        if (!result.data) {
            return result;
        }

        if (result.data && result.data?.commentatorInfo.userId !== userID) {
            // return createResultObject(null, ResultStatus.Forbidden);
            return forbiddenResult.create();
        }

        // return commentRepository.updateComment(commentId, content);
        // return createResultObject(result.matchedCount === 1, ResultStatus.NoContent);
        const isUpdated = await this.commentRepository.updateComment(commentId, content);
        return noContentResult.create(isUpdated);
    }

    async deleteComment(userID: string, commentId: string): NullableServiceDto<boolean> {
        const result = await this.getCommentById(commentId);

        if (!result.data) {
            return result;
        }

        if (result.data && result.data?.commentatorInfo.userId !== userID) {
            // return createResultObject(null, ResultStatus.Forbidden);
            return forbiddenResult.create();
        }

        // return commentRepository.deleteComment(commentId);
        // return createResultObject(result.deletedCount === 1, ResultStatus.NoContent);
        const isDeleted = await this.commentRepository.deleteComment(commentId);
        return noContentResult.create(isDeleted);
    }
}
