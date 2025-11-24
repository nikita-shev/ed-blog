import { Request, Response } from 'express';
import { commentsService } from '../../application/comments.service';
import { resultCodeToHttpException } from '../../../../core/result-object/utils/resultCodeToHttpException';

export async function deleteCommentHandler(req: Request<{ id: string }>, res: Response) {
    const userId = req.appContext.userId as string;
    const result = await commentsService.deleteComment(userId, req.params.id);
    const status = resultCodeToHttpException(result.status);

    if (!result.data) {
        return res.sendStatus(status);
    }

    res.status(status).send(result.data);
}
