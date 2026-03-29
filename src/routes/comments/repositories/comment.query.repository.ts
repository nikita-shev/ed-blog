import { injectable } from 'inversify';
import { CommentModel } from '../schema/schema';
import { successResult } from '../../../core/utils/result-object';
import { createPaginationResult } from '../../../core/utils/pagination-result/pagination-result';
import { mapCommentData } from '../routers/mappers/mapCommentData';
import { Sort } from 'mongodb';
import { SortDirection } from '../../../core/types/sorting.types';
import { CommentsSearchParams } from '../types/transaction.types';
import { OutputDto } from '../../../core/types/dto.types';
import { CommentOutputDto } from '../dto/comment.dto';
import { ServiceDto } from '../../../core/utils/result-object/types/result-object.types';

@injectable()
export class CommentQueryRepository {
    async getComments(
        postId: string,
        queryParams: CommentsSearchParams
    ): Promise<ServiceDto<OutputDto<CommentOutputDto>>> {
        const { pageNumber, pageSize, sortBy, sortDirection } = queryParams;

        const filter = { postId: { $regex: postId, $options: 'i' } };
        // TODO: duplicate 'sorting' all project
        const sorting: Sort = {
            [sortBy]: sortDirection === SortDirection.Asc ? 1 : -1,
            createdAt: sortDirection === SortDirection.Asc ? 1 : -1
        };
        const skip = (pageNumber - 1) * pageSize;

        const comments = await CommentModel.find(filter)
            .sort(sorting)
            .skip(skip)
            .limit(pageSize)
            .lean();
        const totalCount = await CommentModel.countDocuments(filter);

        const data = createPaginationResult(
            { items: comments.map(mapCommentData), totalCount },
            { pageNumber, pageSize }
        );

        return successResult.create(data);
    }
}
