// import { Request, Response } from 'express';
// import { postsService } from '../../application/posts.service';
// import { PostInputDto, PostOutputDto } from '../../dto';
// import { HttpStatus } from '../../../../core/constants/http-statuses';
//
// export async function updatePostHandler(
//     req: Request<{ id: string }, {}, PostInputDto>,
//     res: Response<PostOutputDto>
// ) {
//     const result = await postsService.updatePost(req.params.id, req.body);
//
//     if (!result) {
//         return res.sendStatus(HttpStatus.NotFound);
//     }
//
//     res.sendStatus(HttpStatus.NoContent);
// }
