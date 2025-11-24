import { postsService } from '../../application/posts.service';
import { mapToPostOutput } from '../mappers/mapToPostOutput';
import { HttpStatus } from '../../../core/constants/http-statuses';
import { PostsSearchParams, RequestQuery, ResponseBody } from '../../types/transaction.types';
import { matchedData } from 'express-validator';

export async function getPostsHandler(req: RequestQuery, res: ResponseBody) {
    const sanitizedQuery = matchedData<PostsSearchParams>(req, {
        locations: ['query'],
        includeOptionals: true
    });

    const posts = await postsService.findPosts(sanitizedQuery);
    const result = mapToPostOutput(posts, {
        pageNumber: sanitizedQuery.pageNumber,
        pageSize: sanitizedQuery.pageSize
    });

    res.status(HttpStatus.Success).send(result);
}
