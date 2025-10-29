import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';
import { mapToBlogOutput } from '../mappers/mapToBlogOutput';
import { BlogOutputDto } from '../../dto';
import { HttpStatus } from '../../../core/constants/http-statuses';

export function getBlogsHandler(req: Request, res: Response<BlogOutputDto[]>) {
    const blogs = blogsRepository.findBlog();

    res.status(HttpStatus.Ok).send(blogs.map(mapToBlogOutput));
}
