import { Request, Response } from 'express';
import { postsService } from '../../application/posts.service';
import { authService } from '../../../auth/application/auth.service';
import { resultCodeToHttpException } from '../../../core/utils/result-object/utils/resultCodeToHttpException';
import { CommentInputDto } from '../../dto/post.dto';
import { CommentatorInfo } from '../../../routes/comments/types/comments.types';
import { CommentOutputDto } from '../../../routes/comments/dto/comment.dto';

export async function createCommentHandler(
    req: Request<{ postId: string }, {}, CommentInputDto>,
    res: Response<CommentOutputDto>
) {
    const userId = req.appContext.userId as string;
    const userSearchResult = await authService.getInfoAboutUser(userId);

    if (!userSearchResult.data) {
        return res.sendStatus(resultCodeToHttpException(userSearchResult.status));
    }

    const userInfo: CommentatorInfo = { userId, userLogin: userSearchResult.data.login };
    const result = await postsService.createComment(req.params.postId, req.body.content, userInfo);
    const status = resultCodeToHttpException(result.status);

    if (!result.data) {
        return res.sendStatus(status);
    }

    res.status(status).send(result.data);
}
