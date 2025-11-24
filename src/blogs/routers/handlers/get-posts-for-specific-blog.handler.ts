import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { blogsService } from '../../application/blogs.service';
import { mapToPostOutput } from '../../../posts/routers/mappers/mapToPostOutput';
import { OutputDto } from '../../../core/types/dto.types';
import { PostOutputDto } from '../../../posts/dto';
import { PostsSearchParams } from '../../../posts/types/transaction.types';
import { HttpStatus } from '../../../core/constants/http-statuses';

export async function getPostsForSpecificBlogHandler(
    req: Request<{ blogId: string }, {}, {}, PostsSearchParams>,
    res: Response<OutputDto<PostOutputDto>>
) {
    const blog = await blogsService.getBlogById(req.params.blogId);

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

    const data = await blogsService.getPostsForBlog(req.params.blogId, t);
    const result = mapToPostOutput(data, {
        pageNumber: t.pageNumber,
        pageSize: t.pageSize
    });

    res.status(HttpStatus.Success).send(result);
}
