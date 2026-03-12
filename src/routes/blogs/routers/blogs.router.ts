import { Request, Response, Router } from 'express';
import { authMiddleware } from '../../../core/middlewares/auth.middleware';
import { blogInputDtoValidation } from '../middlewares/validation/blog.input-dto.validation-middlewares';
import { inputValidationResultMiddleware } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { idValidation } from '../../../core/validation/id-validation';
import { queryValidationMiddlewares } from '../middlewares/validation/blog.query.validation-middlewares';
import { BlogSortFields } from '../types/sorting.types';
import { blogIdValidation } from '../middlewares/validation/blog.params.validation-middlewares';
import { postInputWithoutBlogIdDtoValidation } from '../../posts/middlewares/validation/post.input-dto.validation-middlewares';
import { blogsController } from '../../../composition-root';
import { BlogsService } from '../application/blogs.service';
import { BlogInputDto, BlogOutputDto } from '../dto';
import { HttpStatus } from '../../../core/constants/http-statuses';
import { convertBlogData, mapToBlogOutput } from './mappers/mapToBlogOutput';
import { PostInputWithoutBlogIdDto } from '../../posts/dto/post.input-dto';
import { PostOutputDto } from '../../posts/dto';
import { convertPostData, mapToPostOutput } from '../../posts/routers/mappers/mapToPostOutput';
import { BlogsSearchParams, RequestQuery, ResponseBody } from '../types/transaction.types';
import { matchedData } from 'express-validator';
import { PostsSearchParams } from '../../posts/types/transaction.types';
import { OutputDto } from '../../../core/types/dto.types';

export const blogsRouter = Router();

export class BlogsController {
    constructor(private blogsService: BlogsService) {}

    async createBlog(req: Request<{}, {}, BlogInputDto>, res: Response<BlogOutputDto>) {
        const newBlog = await this.blogsService.createBlog(req.body);

        if (!newBlog) {
            return res.sendStatus(HttpStatus.NotFound);
        }

        res.status(HttpStatus.Created).send(convertBlogData(newBlog)); // TODO: convertBlogData
    }

    async createPostForSpecificBlog(
        req: Request<{ blogId: string }, {}, PostInputWithoutBlogIdDto>,
        res: Response<PostOutputDto>
    ) {
        const post = await this.blogsService.createPostForBlog(req.params.blogId, req.body);

        if (!post) {
            return res.sendStatus(HttpStatus.NotFound);
        }

        res.status(HttpStatus.Created).send(convertPostData(post)); // TODO convertPostData
    }

    async deleteBlog(req: Request<{ id: string }>, res: Response) {
        const result = await this.blogsService.deleteBlog(req.params.id);

        if (!result) {
            res.sendStatus(HttpStatus.NotFound);
        }

        res.sendStatus(HttpStatus.NoContent);
    }

    async getBlog(req: Request<{ id: string }>, res: Response<BlogOutputDto>) {
        const blog = await this.blogsService.getBlogById(req.params.id);

        if (!blog) {
            return res.sendStatus(HttpStatus.NotFound);
        }

        res.status(HttpStatus.Success).send(convertBlogData(blog)); // TODO: convertBlogData
    }

    async getBlogs(req: RequestQuery, res: ResponseBody) {
        const sanitizedQuery = matchedData<BlogsSearchParams>(req, {
            locations: ['query'],
            includeOptionals: true
        });

        const data = await this.blogsService.getBlogs(sanitizedQuery);
        const result = mapToBlogOutput(data, {
            pageSize: sanitizedQuery.pageSize,
            pageNumber: sanitizedQuery.pageNumber
        });

        res.status(HttpStatus.Success).send(result);
    }

    async getPostsForSpecificBlog(
        req: Request<{ blogId: string }, {}, {}, PostsSearchParams>,
        res: Response<OutputDto<PostOutputDto>>
    ) {
        const blog = await this.blogsService.getBlogById(req.params.blogId);

        if (!blog) {
            return res.sendStatus(HttpStatus.NotFound);
        }

        const sanitizedQuery = matchedData<PostsSearchParams>(req, {
            locations: ['query'],
            includeOptionals: true
        });

        // TODO tests
        const t: PostsSearchParams = {
            pageNumber: Number(req.query.pageNumber) || 1,
            pageSize: Number(req.query.pageSize) || 10,
            sortBy: req.query.sortBy || 'createdAt',
            sortDirection: req.query.sortDirection || 'desc'
        };

        const data = await this.blogsService.getPostsForBlog(req.params.blogId, t);
        const result = mapToPostOutput(data, {
            pageNumber: t.pageNumber,
            pageSize: t.pageSize
        });

        res.status(HttpStatus.Success).send(result);
    }

    async updateBlog(req: Request<{ id: string }, {}, BlogInputDto>, res: Response) {
        const result = await this.blogsService.updateBlog(req.params.id, req.body);

        if (!result) {
            return res.sendStatus(HttpStatus.NotFound);
        }

        res.sendStatus(HttpStatus.NoContent);
    }
}

blogsRouter
    .get(
        '/',
        queryValidationMiddlewares(BlogSortFields),
        inputValidationResultMiddleware,
        blogsController.getBlogs.bind(blogsController)
    )
    .get(
        '/:blogId/posts',
        // blogIdValidation,
        // queryValidationMiddlewares2(BlogSortFields), // TODO: tests
        // inputValidationResultMiddleware,
        blogsController.getPostsForSpecificBlog.bind(blogsController)
    )
    .get(
        '/:id',
        idValidation,
        inputValidationResultMiddleware,
        blogsController.getBlog.bind(blogsController)
    )
    .post(
        '/',
        authMiddleware,
        blogInputDtoValidation,
        inputValidationResultMiddleware,
        blogsController.createBlog.bind(blogsController)
    )
    .post(
        '/:blogId/posts',
        authMiddleware,
        blogIdValidation,
        postInputWithoutBlogIdDtoValidation,
        inputValidationResultMiddleware,
        blogsController.createPostForSpecificBlog.bind(blogsController)
    )
    .put(
        '/:id',
        authMiddleware,
        idValidation,
        blogInputDtoValidation,
        inputValidationResultMiddleware,
        blogsController.updateBlog.bind(blogsController)
    )
    .delete(
        '/:id',
        authMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        blogsController.deleteBlog.bind(blogsController)
    );
