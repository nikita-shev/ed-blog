import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { matchedData } from 'express-validator';
import { BlogsService } from '../application/blogs.service';
import { BlogInputDto, BlogOutputDto } from '../dto';
import { PostInputWithoutBlogIdDto } from '../../posts/dto/post.input-dto';
import { PostOutputDto } from '../../posts/dto';
import { BlogsSearchParams, RequestQuery, ResponseBody } from '../types/transaction.types';
import { PostsSearchParams } from '../../posts/types/transaction.types';
import { OutputDto } from '../../../core/types/dto.types';
import { resultCodeToHttpException } from '../../../core/utils/result-object/utils/resultCodeToHttpException';
import { createPaginationResult } from '../../../core/utils/pagination-result/pagination-result';

@injectable()
export class BlogsController {
    constructor(@inject(BlogsService) private blogsService: BlogsService) {}

    async createBlog(req: Request<{}, {}, BlogInputDto>, res: Response<BlogOutputDto>) {
        const result = await this.blogsService.createBlog(req.body);
        const status = resultCodeToHttpException(result.status);

        if (!result.data) {
            return res.sendStatus(status);
        }

        res.status(status).send(result.data);
    }

    async createPostForSpecificBlog(
        req: Request<{ blogId: string }, {}, PostInputWithoutBlogIdDto>,
        res: Response<PostOutputDto>
    ) {
        const result = await this.blogsService.createPostForBlog(req.params.blogId, req.body);
        const status = resultCodeToHttpException(result.status);

        if (!result.data) return res.sendStatus(status);

        res.status(status).send(result.data);
    }

    async deleteBlog(req: Request<{ id: string }>, res: Response) {
        const result = await this.blogsService.deleteBlog(req.params.id);
        const status = resultCodeToHttpException(result.status);

        if (!result) {
            return res.sendStatus(status);
        }

        res.sendStatus(status);
    }

    async getBlog(req: Request<{ id: string }>, res: Response<BlogOutputDto>) {
        const result = await this.blogsService.getBlogById(req.params.id);
        const status = resultCodeToHttpException(result.status);

        if (!result.data) {
            return res.sendStatus(status);
        }

        res.status(status).send(result.data);
    }

    async getBlogs(req: RequestQuery, res: ResponseBody) {
        const sanitizedQuery = matchedData<BlogsSearchParams>(req, {
            locations: ['query'],
            includeOptionals: true
        });
        const { data, status } = await this.blogsService.getBlogs(sanitizedQuery);
        const result = createPaginationResult(data, {
            pageSize: sanitizedQuery.pageSize,
            pageNumber: sanitizedQuery.pageNumber
        });

        res.status(resultCodeToHttpException(status)).send(result);
    }

    async getPostsForSpecificBlog(
        req: Request<{ blogId: string }, {}, {}, PostsSearchParams>,
        res: Response<OutputDto<PostOutputDto>>
    ) {
        const blogSearchResult = await this.blogsService.getBlogById(req.params.blogId);
        const status = resultCodeToHttpException(blogSearchResult.status);

        if (!blogSearchResult.data) {
            return res.sendStatus(status);
        }

        // const sanitizedQuery = matchedData<PostsSearchParams>(req, {
        //     locations: ['query'],
        //     includeOptionals: true
        // });

        // TODO tests
        const t: PostsSearchParams = {
            pageNumber: Number(req.query.pageNumber) || 1,
            pageSize: Number(req.query.pageSize) || 10,
            sortBy: req.query.sortBy || 'createdAt',
            sortDirection: req.query.sortDirection || 'desc'
        };

        const postsSearchResult = await this.blogsService.getPostsForBlog(req.params.blogId, t);
        const result = createPaginationResult(postsSearchResult.data, {
            pageNumber: t.pageNumber,
            pageSize: t.pageSize
        });

        res.status(resultCodeToHttpException(postsSearchResult.status)).send(result);
    }

    async updateBlog(req: Request<{ id: string }, {}, BlogInputDto>, res: Response) {
        const result = await this.blogsService.updateBlog(req.params.id, req.body);
        const status = resultCodeToHttpException(result.status);

        if (!result.data) {
            return res.sendStatus(status);
        }

        res.sendStatus(status);
    }
}
