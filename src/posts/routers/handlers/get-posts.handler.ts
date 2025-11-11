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

    // TODO: fix
    const t =
        Object.keys(sanitizedQuery).length > 0
            ? sanitizedQuery
            : {
                  pageNumber: 1,
                  pageSize: 10,
                  searchNameTerm: '',
                  sortBy: 'createdAt',
                  sortDirection: 'desc'
              };

    const posts = await postsService.findPosts(t);
    const result = mapToPostOutput(posts, {
        pageNumber: t.pageNumber,
        pageSize: t.pageSize
    });

    res.status(HttpStatus.Ok).send(result);
}
