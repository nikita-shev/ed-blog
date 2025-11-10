import { Request, Response } from 'express';

import { BlogInputDto, BlogOutputDto } from '../../dto';
import { blogsRepository } from '../../repositories/blogs.repository';
import { HttpStatus } from '../../../core/constants/http-statuses';
import { convertBlogData } from '../mappers/mapToBlogOutput';

export async function createBlogHandler(
    req: Request<{}, {}, BlogInputDto>,
    res: Response<BlogOutputDto>
) {
    const newBlog = await blogsRepository.createNewBlog(req.body);

    res.status(HttpStatus.Created).send(convertBlogData(newBlog));
}
