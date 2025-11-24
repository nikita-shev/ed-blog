import { commentRepository } from '../repositories/comment.repository';
import { convertCommentData } from '../routers/mappers/mapToCommentOutput';
import { createResultObject } from '../../../core/result-object/utils/createResultObject';
import {
    NullableResultObject,
    ResultStatus
} from '../../../core/result-object/result-object.types';
import { CommentInputDto, CommentOutputDto } from '../dto/comment.dto';

export const commentsService = {
    async getCommentById(id: string): NullableResultObject<CommentOutputDto> {
        const result = await commentRepository.getCommentById(id);

        if (!result.data) {
            return result;
        }

        return createResultObject(convertCommentData(result.data));
    },

    async updateComment(
        userID: string,
        commentId: string,
        content: CommentInputDto
    ): NullableResultObject<boolean> {
        const result = await this.getCommentById(commentId);

        if (result.data?.commentatorInfo.userId !== userID) {
            return createResultObject(null, ResultStatus.Forbidden);
        }

        return commentRepository.updateComment(commentId, content);
    },

    async deleteComment(userID: string, commentId: string): NullableResultObject<boolean> {
        const result = await this.getCommentById(commentId);

        if (!result.data) {
            return result;
        }

        if (result.data && result.data?.commentatorInfo.userId !== userID) {
            return createResultObject(null, ResultStatus.Forbidden);
        }

        return commentRepository.deleteComment(commentId);
    }
};
