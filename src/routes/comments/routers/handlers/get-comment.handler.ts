// import { Request, Response } from 'express';
// import { commentsService } from '../../application/comments.service';
// import { resultCodeToHttpException } from '../../../../core/utils/result-object/utils/resultCodeToHttpException';
// import { CommentOutputDto } from '../../dto/comment.dto';
//
// export async function getCommentHandler(
//     req: Request<{ id: string }>,
//     res: Response<CommentOutputDto>
// ) {
//     const result = await commentsService.getCommentById(req.params.id);
//     const status = resultCodeToHttpException(result.status);
//
//     if (!result.data) {
//         return res.sendStatus(status);
//     }
//
//     res.status(status).send(result.data);
// }
