import { CommentWithId } from '../../types/comments.types';
import { CommentOutputDto } from '../../dto/comment.dto';

export function mapCommentData(comment: CommentWithId): CommentOutputDto {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt
    };
}
