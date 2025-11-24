import { CommentsSearchParams } from '../../types/transaction.types';
import { CommentWithId } from '../../types/comments.types';
import { CommentOutputDto } from '../../dto/comment.dto';
import { OutputDto, SearchResult } from '../../../../core/types/dto.types';

type ParamsType = Pick<CommentsSearchParams, 'pageSize' | 'pageNumber'>;

export function convertCommentData(comment: CommentWithId): CommentOutputDto {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt
    };
}

// TODO: duplicate, move to 'core'
export function mapToCommentOutput(
    data: SearchResult<CommentWithId>,
    params: ParamsType
): OutputDto<CommentOutputDto> {
    const { items, totalCount } = data;
    const { pageNumber: page, pageSize } = params;
    const comments = items.map(convertCommentData);

    return {
        pagesCount: Math.ceil(totalCount / pageSize),
        page,
        pageSize,
        totalCount,
        items: comments
    };
}
