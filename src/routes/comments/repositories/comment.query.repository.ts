import { Sort } from 'mongodb';
import { commentCollection, userCollection } from '../../../db/db.config';
import { convertCommentData, mapToCommentOutput } from '../routers/mappers/mapToCommentOutput';
import { SortDirection } from '../../../core/types/sorting.types';
import { CommentsSearchParams } from '../types/transaction.types';
import { OutputDto } from '../../../core/types/dto.types';
import { CommentOutputDto } from '../dto/comment.dto';

export const commentQueryRepository = {
    async getComments(
        postId: string,
        queryParams: CommentsSearchParams
    ): Promise<OutputDto<CommentOutputDto>> {
        const { pageNumber, pageSize, sortBy, sortDirection } = queryParams;

        const filter = { postId: { $regex: postId, $options: 'i' } };
        // TODO: duplicate 'sorting' all project
        const sorting: Sort = {
            [sortBy]: sortDirection === SortDirection.Asc ? 1 : -1,
            createdAt: sortDirection === SortDirection.Asc ? 1 : -1
        };
        const skip = (pageNumber - 1) * pageSize;

        const comments = await commentCollection
            .find(filter)
            .sort(sorting)
            .skip(skip)
            .limit(pageSize)
            .toArray();
        const totalCount = await userCollection.countDocuments(filter);

        return this._mapToCommentOutput({ items: comments, totalCount }, { pageNumber, pageSize }); // TODO: ResultObj ???
    },

    _convertCommentData: convertCommentData,
    _mapToCommentOutput: mapToCommentOutput
};
