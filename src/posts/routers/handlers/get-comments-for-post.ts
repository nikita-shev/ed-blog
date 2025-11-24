import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { commentQueryRepository } from '../../../routes/comments/repositories/comment.query.repository';
import { HttpStatus } from '../../../core/constants/http-statuses';
import { OutputDto } from '../../../core/types/dto.types';
import { CommentOutputDto } from '../../../routes/comments/dto/comment.dto';
import { CommentsSearchParams } from '../../../routes/comments/types/transaction.types';
import { postsService } from '../../application/posts.service';

export async function getCommentsForPost(
    req: Request<{ postId: string }, {}, {}, CommentsSearchParams>,
    res: Response<OutputDto<CommentOutputDto>>
) {
    const post = await postsService.findPostById(req.params.postId);

    if (!post) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    const sanitizedQuery = matchedData<CommentsSearchParams>(req, {
        locations: ['query'],
        includeOptionals: true
    });
    const comments = await commentQueryRepository.getComments(req.params.postId, sanitizedQuery);

    res.status(HttpStatus.Success).send(comments);
}
