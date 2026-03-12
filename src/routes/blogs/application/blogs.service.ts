import { Blog, BlogWithId } from '../types/blog.types';
import { SearchResult } from '../../../core/types/dto.types';
import { BlogsSearchParams } from '../types/transaction.types';
import { BlogInputDto } from '../dto';
import { PostInputWithoutBlogIdDto } from '../../posts/dto/post.input-dto';
import { PostWithId } from '../../posts/types/posts.types';
import { PostsSearchParams } from '../../posts/types/transaction.types';
import { BlogsRepository } from '../repositories/blogs.repository';
import { PostsService } from '../../posts/application/posts.service';

export class BlogsService {
    constructor(
        private blogsRepository: BlogsRepository,
        private postsService: PostsService
    ) {}

    async getBlogs(params: BlogsSearchParams): Promise<SearchResult<BlogWithId>> {
        return this.blogsRepository.findBlogs(params);
    }

    async getBlogById(id: string): Promise<BlogWithId | null> {
        return this.blogsRepository.findBlogById(id);
    }

    async createBlog(data: BlogInputDto): Promise<BlogWithId | null> {
        const { name, description, websiteUrl } = data;
        const newBlog: Blog = {
            createdAt: new Date().toISOString(),
            isMembership: false,
            name,
            description,
            websiteUrl
        };
        const blogId = await this.blogsRepository.createNewBlog(newBlog);

        return this.getBlogById(blogId); // TODO: 50/50
    }

    async updateBlog(id: string, data: BlogInputDto): Promise<boolean> {
        return this.blogsRepository.updateBlog(id, data);
    }

    async deleteBlog(id: string): Promise<boolean> {
        return this.blogsRepository.deleteBlog(id);
    }

    async getPostsForBlog(
        blogId: string,
        params: PostsSearchParams // TODO: rename
    ): Promise<SearchResult<PostWithId>> {
        return this.postsService.findPosts(params, { blogId });
    }

    async createPostForBlog(
        blogId: string,
        data: PostInputWithoutBlogIdDto
    ): Promise<PostWithId | null> {
        const { title, shortDescription, content } = data;
        const blog = await this.getBlogById(blogId);

        if (!blog) {
            return null;
        }

        return this.postsService.createPost({ blogId, title, shortDescription, content });
    }
}
