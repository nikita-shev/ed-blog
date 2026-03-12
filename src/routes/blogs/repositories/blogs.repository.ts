import { ObjectId, Sort } from 'mongodb';
import { Blog, BlogWithId } from '../types/blog.types';
import { BlogInputDto } from '../dto';
import { blogCollection } from '../../../db/db.config';
import { SearchResult } from '../../../core/types/dto.types';
import { BlogsSearchParams } from '../types/transaction.types';
import { SortDirection } from '../../../core/types/sorting.types';

export const blogsRepository = {
    async findBlogs(params: BlogsSearchParams): Promise<SearchResult<BlogWithId>> {
        const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = params;

        const filter = { name: { $regex: searchNameTerm, $options: 'i' } };
        const sorting: Sort = { [sortBy]: sortDirection === SortDirection.Asc ? 1 : -1 };
        const skip = (pageNumber - 1) * pageSize;

        const blogs = await blogCollection
            .find(filter)
            .sort(sorting)
            .skip(skip)
            .limit(pageSize)
            .toArray();
        const totalCount = await blogCollection.countDocuments(filter);

        return { items: blogs, totalCount };
    },

    async findBlogById(id: string): Promise<BlogWithId | null> {
        return blogCollection.findOne({ _id: new ObjectId(id) });
    },

    async createNewBlog(data: Blog): Promise<string> {
        const insertResult = await blogCollection.insertOne(data);

        return insertResult.insertedId.toString();
    },

    async updateBlog(id: string, data: BlogInputDto): Promise<boolean> {
        const result = await blogCollection.updateOne({ _id: new ObjectId(id) }, { $set: data });

        return result.matchedCount === 1;
    },

    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });

        return result.deletedCount === 1;
    }
};
