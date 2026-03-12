// import { Request, Response } from 'express';
// import { CommentInputDto } from '../../dto/comment.dto';
// import { commentsService } from '../../application/comments.service';
// import { resultCodeToHttpException } from '../../../../core/utils/result-object/utils/resultCodeToHttpException';
//
// // TODO: fix types for req
// export async function updateCommentHandler(
//     req: Request<{ id: string }, {}, CommentInputDto>,
//     res: Response
// ) {
//     const userId = req.appContext.userId as string;
//     const result = await commentsService.updateComment(userId, req.params.id, req.body);
//     const status = resultCodeToHttpException(result.status);
//
//     if (!result.data) {
//         return res.sendStatus(status);
//     }
//
//     res.status(status).send(result.data);
// }
