// import { Request, Response } from 'express';
// import { PostOutputDto } from '../../dto';
// import { HttpStatus } from '../../../../core/constants/http-statuses';
// import { convertPostData, mapToPostOutput } from '../mappers/mapToPostOutput';
// import { postsService } from '../../application/posts.service';
//
// export async function getPostHandler(req: Request<{ id: string }>, res: Response<PostOutputDto>) {
//     const post = await postsService.findPostById(req.params.id);
//
//     if (!post) {
//         // throw new Error('Post not found');
//         return res.sendStatus(HttpStatus.NotFound);
//     }
//
//     return res.status(HttpStatus.Success).send(convertPostData(post)); // TODO: convertPostData
// }
