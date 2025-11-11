import { postsService } from '../../application/posts.service';
import { mapToPostOutput } from '../mappers/mapToPostOutput';
import { HttpStatus } from '../../../core/constants/http-statuses';
import { RequestQuery, ResponseBody } from '../../types/transaction.types';

export async function getPostsHandler(req: RequestQuery, res: ResponseBody) {
    const posts = await postsService.findPosts(req.query);

    res.status(HttpStatus.Ok).send(
        mapToPostOutput(posts, { pageNumber: req.query.pageNumber, pageSize: req.query.pageSize })
    );
}
