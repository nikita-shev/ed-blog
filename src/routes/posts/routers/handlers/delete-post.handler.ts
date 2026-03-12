// import { Request, Response } from 'express';
// import { postsService } from '../../application/posts.service';
// import { HttpStatus } from '../../../../core/constants/http-statuses';
//
// export async function deletePostHandler(req: Request<{ id: string }>, res: Response) {
//     const result = await postsService.deletePost(req.params.id);
//
//     if (!result) {
//         return res.sendStatus(HttpStatus.NotFound);
//     }
//
//     res.sendStatus(HttpStatus.NoContent);
// }
