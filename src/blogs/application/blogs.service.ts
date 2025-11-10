import { blogsRepository } from '../repositories/blogs.repository';
import { Blog, BlogWithId } from '../types/blog.types';
import { SearchResult } from '../../core/types/dto.types';
import { BlogsSearchParams } from '../types/transaction.types';
import { BlogInputDto } from '../dto';

export const blogsService = {
    async getBlogs(params: BlogsSearchParams): Promise<SearchResult<BlogWithId>> {
        return blogsRepository.findBlogs(params);
    },

    async getBlogById(id: string): Promise<BlogWithId | null> {
        return blogsRepository.findBlogById(id);
    },

    async createBlog(data: BlogInputDto): Promise<BlogWithId | null> {
        const newBlog: Blog = {
            createdAt: new Date().toISOString(),
            isMembership: false,
            ...data
        };
        const blogId = await blogsRepository.createNewBlog(newBlog);

        return this.getBlogById(blogId); // TODO: 50/50
    }
};
