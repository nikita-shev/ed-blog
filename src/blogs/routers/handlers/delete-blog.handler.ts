import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';
import { HttpStatus } from '../../../core/constants/http-statuses';

export async function deleteBlogHandler(req: Request<{ id: string }>, res: Response) {
    const result = await blogsRepository.deleteBlog(req.params.id);

    if (!result) {
        res.sendStatus(HttpStatus.NotFound);
    }

    res.sendStatus(HttpStatus.NoContent);
}
