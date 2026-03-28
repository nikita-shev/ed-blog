import { inject, injectable } from 'inversify';
import { BlogModel } from '../schema/schema';
import {
    createdResult,
    noContentResult,
    notFoundResult,
    successResult
} from '../../../core/utils/result-object';
import { mapBlogData } from '../routers/mappers/mapBlogData';
import { PaginationResult, SearchResult } from '../../../core/types/dto.types';
import { BlogsSearchParams } from '../types/transaction.types';
import { BlogInputDto, BlogOutputDto } from '../dto';
import { PostInputWithoutBlogIdDto } from '../../posts/dto/post.input-dto';
import { PostWithId } from '../../posts/types/posts.types';
import { PostsSearchParams } from '../../posts/types/transaction.types';
import { BlogsRepository } from '../repositories/blogs.repository';
import { PostsService } from '../../posts/application/posts.service';
import { ServiceDto } from '../../../core/utils/result-object/types/result-object.types';

@injectable()
export class BlogsService {
    constructor(
        @inject(BlogsRepository) private blogsRepository: BlogsRepository,
        @inject(PostsService) private postsService: PostsService
    ) {}

    async getBlogs(
        params: BlogsSearchParams
    ): Promise<ServiceDto<PaginationResult<BlogOutputDto>>> {
        const { items: blogs, totalCount } = await this.blogsRepository.findBlogs(params);

        return successResult.create({ items: blogs.map(mapBlogData), totalCount });
    }

    async getBlogById(id: string): Promise<ServiceDto<BlogOutputDto | null>> {
        const blog = await this.blogsRepository.findBlogById(id);

        return blog ? successResult.create(mapBlogData(blog)) : notFoundResult.create(null);
    }

    async createBlog(data: BlogInputDto): Promise<ServiceDto<BlogOutputDto | null>> {
        const { name, description, websiteUrl } = data;
        const newBlog = new BlogModel({
            createdAt: new Date().toISOString(),
            isMembership: false,
            name,
            description,
            websiteUrl
        });
        await this.blogsRepository.save(newBlog);

        const result = await this.getBlogById(newBlog.id);
        return result.data ? createdResult.create(result.data) : result;
    }

    async updateBlog(id: string, data: BlogInputDto): Promise<ServiceDto<boolean | null>> {
        const blog = await this.blogsRepository.findBlogById(id);

        if (!blog) return notFoundResult.create();

        blog.name = data.name;
        blog.description = data.description;
        blog.websiteUrl = data.websiteUrl;

        await this.blogsRepository.save(blog);

        return noContentResult.create(true);
    }

    async deleteBlog(id: string): Promise<ServiceDto<boolean>> {
        const result = await this.blogsRepository.deleteBlog(id);

        return result ? noContentResult.create(result) : notFoundResult.create(result);
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

        if (!blog.data) {
            return null;
        }

        return this.postsService.createPost({ blogId, title, shortDescription, content });
    }
}

// TODO: исправить getPostsForBlog и createPostForBlog после фикса постов
