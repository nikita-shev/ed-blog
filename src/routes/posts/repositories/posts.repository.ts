import { injectable } from 'inversify';
import { PostDocument, PostModel } from '../schema/schema';
import { createFilter } from '../routers/utils/createFilter';
import { PostWithId } from '../types/posts.types';
import { Sort } from 'mongodb';
import { PaginationResult } from '../../../core/types/dto.types';
import { SortDirection } from '../../../core/types/sorting.types';
import { PostsSearchParams } from '../types/transaction.types';
import { PostFilters } from '../types/filter.types';

@injectable()
export class PostsRepository {
    async save(document: PostDocument): Promise<void> {
        await document.save();
    }

    async findPosts(
        params: PostsSearchParams,
        filteringParams?: PostFilters
    ): Promise<PaginationResult<PostWithId>> {
        const { pageSize, pageNumber, sortBy, sortDirection } = params;

        const filter = createFilter(filteringParams);
        const sorting: Sort = {
            [sortBy]: sortDirection === SortDirection.Asc ? 1 : -1,
            createdAt: sortDirection === SortDirection.Asc ? 1 : -1
        };
        const skip = (pageNumber - 1) * pageSize;

        const posts = await PostModel.find(filter).sort(sorting).skip(skip).limit(pageSize).lean();
        const totalCount = await PostModel.countDocuments(filter);

        return { items: posts, totalCount };
    }

    async findPostById(id: string): Promise<PostDocument | null> {
        return PostModel.findOne({ _id: id });
    }

    async deletePost(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({ _id: id });

        return result.deletedCount === 1;
    }
}
