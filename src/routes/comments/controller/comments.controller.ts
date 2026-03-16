import { CommentsService } from '../application/comments.service';
import { Request, Response } from 'express';
import { CommentInputDto, CommentOutputDto } from '../dto/comment.dto';
import { resultCodeToHttpException } from '../../../core/utils/result-object/utils/resultCodeToHttpException';

export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    async getComment(req: Request<{ id: string }>, res: Response<CommentOutputDto>) {
        const result = await this.commentsService.getCommentById(req.params.id);
        const status = resultCodeToHttpException(result.status);

        if (!result.data) {
            return res.sendStatus(status);
        }

        res.status(status).send(result.data);
    }

    async updateComment(req: Request<{ id: string }, {}, CommentInputDto>, res: Response) {
        const userId = req.appContext.userId as string;
        const result = await this.commentsService.updateComment(userId, req.params.id, req.body);
        const status = resultCodeToHttpException(result.status);

        if (!result.data) {
            return res.sendStatus(status);
        }

        res.status(status).send(result.data);
    }

    async deleteComment(req: Request<{ id: string }>, res: Response) {
        const userId = req.appContext.userId as string;
        const result = await this.commentsService.deleteComment(userId, req.params.id);
        const status = resultCodeToHttpException(result.status);

        if (!result.data) {
            return res.sendStatus(status);
        }

        res.status(status).send(result.data);
    }
}
