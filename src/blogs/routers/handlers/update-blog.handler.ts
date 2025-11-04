import { Request, Response } from 'express';
import { BlogInputDto } from '../../dto';
import { blogsRepository } from '../../repositories/blogs.repository';
import { HttpStatus } from '../../../core/constants/http-statuses';

export async function updateBlogHandler(
    req: Request<{ id: string }, {}, BlogInputDto>,
    res: Response
) {
    const result = await blogsRepository.updateBlog(req.params.id, req.body);

    if (!result) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    res.sendStatus(HttpStatus.NoContent);
}
