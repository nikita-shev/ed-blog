import { blogsRepository } from '../repositories/blogs.repository';
import { postsService } from '../../posts/application/posts.service';
import { Blog, BlogWithId } from '../types/blog.types';
import { SearchResult } from '../../core/types/dto.types';
import { BlogsSearchParams } from '../types/transaction.types';
import { BlogInputDto } from '../dto';
import { PostInputWithoutBlogIdDto } from '../../posts/dto/post.input-dto';
import { PostWithId } from '../../posts/types/posts.types';
import { PostsSearchParams } from '../../posts/types/transaction.types';

export const blogsService = {
    async getBlogs(params: BlogsSearchParams): Promise<SearchResult<BlogWithId>> {
        return blogsRepository.findBlogs(params);
    },

    async getBlogById(id: string): Promise<BlogWithId | null> {
        return blogsRepository.findBlogById(id);
    },

    async createBlog(data: BlogInputDto): Promise<BlogWithId | null> {
        const { name, description, websiteUrl } = data;
        const newBlog: Blog = {
            createdAt: new Date().toISOString(),
            isMembership: false,
            name,
            description,
            websiteUrl
        };
        const blogId = await blogsRepository.createNewBlog(newBlog);

        return this.getBlogById(blogId); // TODO: 50/50
    },

    async updateBlog(id: string, data: BlogInputDto): Promise<boolean> {
        return blogsRepository.updateBlog(id, data);
    },

    async deleteBlog(id: string): Promise<boolean> {
        return blogsRepository.deleteBlog(id);
    },

    async getPostsForBlog(
        blogId: string,
        params: PostsSearchParams
    ): Promise<SearchResult<PostWithId>> {
        return postsService.findPosts(params, { blogId });
    },

    async createPostForBlog(
        blogId: string,
        data: PostInputWithoutBlogIdDto
    ): Promise<PostWithId | null> {
        const { title, shortDescription, content } = data;

        return postsService.createPost({ blogId, title, shortDescription, content });
    }
};
