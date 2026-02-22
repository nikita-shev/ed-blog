import { Express } from 'express';
import request from 'supertest';
import { authorizationData } from '../constants/mock-data';
import { PATHS } from '../../../src/core/constants/paths';
import { BlogInputDto, BlogOutputDto } from '../../../src/blogs/dto';
import { PostInputWithoutBlogIdDto } from '../../../src/posts/dto/post.input-dto';
import { PostOutputDto } from '../../../src/posts/dto';

export class TestData {
    private blogs: BlogOutputDto[];
    private posts: PostOutputDto[];

    constructor(private app: Express) {
        this.blogs = [];
        this.posts = [];
    }

    async createBlogs(mockData: number[]): Promise<BlogOutputDto[]> {
        this.blogs = [];

        for (const value of mockData) {
            const data: BlogInputDto = {
                name: `Blog ${value}`,
                description: `blog description ${value}`,
                websiteUrl: `https://www.google${value}.com`
            };

            const response = await request(this.app)
                .post(`${PATHS.blogs}/`)
                .set('Authorization', authorizationData)
                .send(data);

            this.blogs.push(response.body);
        }

        return this.blogs;
    }

    async createPosts(blogId: string, mockData: number[]): Promise<PostOutputDto[]> {
        this.posts = [];

        for (const value of mockData) {
            const data: PostInputWithoutBlogIdDto = {
                title: `Post ${value}`,
                shortDescription: `Post short description ${value}`,
                content: `Post content ${value}`
            };

            const response = await request(this.app)
                .post(`${PATHS.blogs}/${blogId}/posts`)
                .set('Authorization', authorizationData)
                .send(data);

            this.posts.push(response.body);
        }

        return this.posts;
    }
}
