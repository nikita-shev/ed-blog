// import { Request, Response } from 'express';
// import { PostOutputDto } from '../../../posts/dto';
// import { blogsService } from '../../application/blogs.service';
// import { HttpStatus } from '../../../../core/constants/http-statuses';
// import { convertPostData, mapToPostOutput } from '../../../posts/routers/mappers/mapToPostOutput';
// import { PostInputWithoutBlogIdDto } from '../../../posts/dto/post.input-dto';
//
// export async function createPostForSpecificBlogHandler(
//     req: Request<{ blogId: string }, {}, PostInputWithoutBlogIdDto>,
//     res: Response<PostOutputDto>
// ) {
//     const post = await blogsService.createPostForBlog(req.params.blogId, req.body);
//
//     if (!post) {
//         return res.sendStatus(HttpStatus.NotFound);
//     }
//
//     res.status(HttpStatus.Created).send(convertPostData(post)); // TODO convertPostData
// }
