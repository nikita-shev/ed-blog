import { blogsRepository } from '../repositories/blogs.repository';
import { BlogWithId } from '../types/blog.types';
import { SearchResult } from '../../core/types/dto.types';
import { BlogsSearchParams } from '../types/transaction.types';

export const blogsService = {
    async getBlogs(params: BlogsSearchParams): Promise<SearchResult<BlogWithId>> {
        return blogsRepository.findBlogs(params);
    }
};
