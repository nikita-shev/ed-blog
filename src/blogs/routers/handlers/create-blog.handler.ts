import { Request, Response } from 'express';

import { BlogInputDto, BlogOutputDto } from '../../dto';
import { blogsRepository } from '../../repositories/blogs.repository';
import { HttpStatus } from '../../../core/constants/http-statuses';
import { mapToBlogOutput } from '../mappers/mapToBlogOutput';

export function createBlogHandler(req: Request<{}, {}, BlogInputDto>, res: Response<BlogOutputDto>) {
    const newBlog = blogsRepository.createNewBlog(req.body);

    res.status(HttpStatus.Created).send(mapToBlogOutput(newBlog));
}
