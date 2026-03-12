// import { Request, Response } from 'express';
// import { blogsService } from '../../application/blogs.service';
// import { HttpStatus } from '../../../../core/constants/http-statuses';
// import { convertBlogData, mapToBlogOutput } from '../mappers/mapToBlogOutput';
// import { BlogOutputDto } from '../../dto';
//
// export async function getBlogHandler(req: Request<{ id: string }>, res: Response<BlogOutputDto>) {
//     const blog = await blogsService.getBlogById(req.params.id);
//
//     if (!blog) {
//         return res.sendStatus(HttpStatus.NotFound);
//     }
//
//     res.status(HttpStatus.Success).send(convertBlogData(blog)); // TODO: convertBlogData
// }
