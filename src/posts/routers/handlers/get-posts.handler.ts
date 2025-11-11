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
    console.log(req.query);
    const t =
        Object.keys(sanitizedQuery).length > 0
            ? sanitizedQuery
            : {
                  pageNumber: Number(req.query.pageNumber) || 1,
                  pageSize: Number(req.query.pageSize) || 10,
                  // searchNameTerm: req.query.searchNameTerm ?? '',
                  sortBy: req.query.sortBy ?? 'createdAt',
                  sortDirection: req.query.sortDirection ??'desc'
              };
    console.log(t);

    const posts = await postsService.findPosts(t);
    const result = mapToPostOutput(posts, {
        pageNumber: t.pageNumber,
        pageSize: t.pageSize
    });

    res.status(HttpStatus.Ok).send(result);
}
