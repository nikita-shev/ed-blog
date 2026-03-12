import { Request, Response, Router } from 'express';
import { validateId } from '../../../core/validation/id-validation';
import { inputValidationResultMiddleware } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { authBearerMiddleware } from '../../../core/middlewares/auth.middleware';
import { commentInputDtoValidation } from '../../posts/middlewares/validation/input-dto-validation';
import { CommentsService } from '../application/comments.service';
import { CommentInputDto, CommentOutputDto } from '../dto/comment.dto';
import { resultCodeToHttpException } from '../../../core/utils/result-object/utils/resultCodeToHttpException';
import { commentsController } from '../../../composition-root';

export const commentsRouter = Router();

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

commentsRouter
    .get(
        '/:id',
        validateId('id'),
        inputValidationResultMiddleware,
        commentsController.getComment.bind(commentsController)
    )
    .put(
        '/:id',
        authBearerMiddleware,
        validateId('id'),
        commentInputDtoValidation,
        inputValidationResultMiddleware,
        commentsController.updateComment.bind(commentsController)
    )
    .delete(
        '/:id',
        authBearerMiddleware,
        validateId('id'),
        inputValidationResultMiddleware,
        commentsController.deleteComment.bind(commentsController)
    );
