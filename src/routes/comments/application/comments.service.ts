import { commentRepository } from '../repositories/comment.repository';
import { convertCommentData } from '../routers/mappers/mapToCommentOutput';
import { forbiddenResult, successResult } from '../../../core/utils/result-object';
import { NullableServiceDto } from '../../../core/utils/result-object/types/result-object.types';
import { CommentInputDto, CommentOutputDto } from '../dto/comment.dto';

export const commentsService = {
    async getCommentById(id: string): NullableServiceDto<CommentOutputDto> {
        const result = await commentRepository.getCommentById(id);

        if (!result.data) {
            return result;
        }

        // return createResultObject(convertCommentData(result.data));
        return successResult.create(convertCommentData(result.data));
    },

    async updateComment(
        userID: string,
        commentId: string,
        content: CommentInputDto
    ): NullableServiceDto<boolean> {
        const result = await this.getCommentById(commentId);

        if (!result.data) {
            return result;
        }

        if (result.data && result.data?.commentatorInfo.userId !== userID) {
            // return createResultObject(null, ResultStatus.Forbidden);
            return forbiddenResult.create();
        }

        return commentRepository.updateComment(commentId, content);
    },

    async deleteComment(userID: string, commentId: string): NullableServiceDto<boolean> {
        const result = await this.getCommentById(commentId);

        if (!result.data) {
            return result;
        }

        if (result.data && result.data?.commentatorInfo.userId !== userID) {
            // return createResultObject(null, ResultStatus.Forbidden);
            return forbiddenResult.create();
        }

        return commentRepository.deleteComment(commentId);
    }
};
