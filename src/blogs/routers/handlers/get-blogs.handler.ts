import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';
import { mapToBlogOutput } from '../mappers/mapToBlogOutput';
import { BlogOutputDto } from '../../dto';

export function getBlogsHandler(req: Request, res: Response<BlogOutputDto[]>) {
    const blogs = blogsRepository.findBlog();

    res.status(200).send(blogs.map(mapToBlogOutput));
}
