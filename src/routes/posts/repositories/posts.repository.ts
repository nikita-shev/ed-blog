import { postCollection } from '../../../db/db.config';
import { createFilter } from '../routers/utils/createFilter';
import { Post, PostWithId } from '../types/posts.types';
import { PostInputDto } from '../dto';
import { ObjectId, Sort } from 'mongodb';
import { SearchResult } from '../../../core/types/dto.types';
import { SortDirection } from '../../../core/types/sorting.types';
import { PostsSearchParams } from '../types/transaction.types';
import { PostFilters } from '../types/filter.types';

export class PostsRepository {
    async findPosts(
        params: PostsSearchParams,
        filteringParams?: PostFilters
    ): Promise<SearchResult<PostWithId>> {
        const { pageSize, pageNumber, sortBy, sortDirection } = params;

        const filter = createFilter(filteringParams);
        const sorting: Sort = {
            [sortBy]: sortDirection === SortDirection.Asc ? 1 : -1,
            createdAt: sortDirection === SortDirection.Asc ? 1 : -1
        };
        const skip = (pageNumber - 1) * pageSize;

        const posts = await postCollection
            .find(filter)
            .sort(sorting)
            .skip(skip)
            .limit(pageSize)
            .toArray();
        const totalCount = await postCollection.countDocuments(filter);

        return { items: posts, totalCount };
    }

    async findPostById(id: string): Promise<PostWithId | null> {
        return postCollection.findOne({ _id: new ObjectId(id) });
    }

    async createPost(data: Post): Promise<string> {
        const insertResult = await postCollection.insertOne(data);

        return insertResult.insertedId.toString();
    }

    async updatePost(id: string, data: PostInputDto): Promise<boolean> {
        const result = await postCollection.updateOne({ _id: new ObjectId(id) }, { $set: data });

        return result.matchedCount === 1;
    }

    async deletePost(id: string): Promise<boolean> {
        const result = await postCollection.deleteOne({ _id: new ObjectId(id) });

        return result.deletedCount === 1;
    }
}
