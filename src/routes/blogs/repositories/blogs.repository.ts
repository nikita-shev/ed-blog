import { injectable } from 'inversify';
import { BlogDocument, BlogModel } from '../schema/schema';
import { Sort } from 'mongodb';
import { BlogWithId } from '../types/blog.types';
import { PaginationResult } from '../../../core/types/dto.types';
import { BlogsSearchParams } from '../types/transaction.types';
import { SortDirection } from '../../../core/types/sorting.types';

@injectable()
export class BlogsRepository {
    async save(document: BlogDocument): Promise<void> {
        await document.save();
    }

    async findBlogs(params: BlogsSearchParams): Promise<PaginationResult<BlogWithId>> {
        const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = params;

        const filter = { name: { $regex: searchNameTerm, $options: 'i' } };
        const sorting: Sort = { [sortBy]: sortDirection === SortDirection.Asc ? 1 : -1 };
        const skip = (pageNumber - 1) * pageSize;

        const blogs = await BlogModel.find(filter).sort(sorting).skip(skip).limit(pageSize).lean();
        const totalCount = await BlogModel.countDocuments(filter);

        return { items: blogs, totalCount };
    }

    async findBlogById(id: string): Promise<BlogDocument | null> {
        return BlogModel.findOne({ _id: id });
    }

    async deleteBlog(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({ _id: id });

        return result.deletedCount === 1;
    }
}
