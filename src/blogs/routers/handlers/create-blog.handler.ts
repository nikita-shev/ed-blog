import { Request, Response } from 'express';

import { BlogInputDto, BlogOutputDto } from '../../dto';
import { blogsService } from '../../application/blogs.service';
import { HttpStatus } from '../../../core/constants/http-statuses';
import { convertBlogData } from '../mappers/mapToBlogOutput';

export async function createBlogHandler(
    req: Request<{}, {}, BlogInputDto>,
    res: Response<BlogOutputDto>
) {
    const newBlog = await blogsService.createBlog(req.body);

    if (!newBlog) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    res.status(HttpStatus.Created).send(convertBlogData(newBlog)); // TODO: convertBlogData
}
