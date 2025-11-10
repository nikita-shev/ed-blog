import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';
import { HttpStatus } from '../../../core/constants/http-statuses';
import { convertBlogData, mapToBlogOutput } from '../mappers/mapToBlogOutput';
import { BlogOutputDto } from '../../dto';

export async function getBlogHandler(req: Request<{ id: string }>, res: Response<BlogOutputDto>) {
    const blog = await blogsRepository.findBlogById(req.params.id);

    if (!blog) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    res.status(HttpStatus.Ok).send(convertBlogData(blog));
}
