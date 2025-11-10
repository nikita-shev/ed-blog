import { Request, Response } from 'express';
import { blogsService } from '../../application/blogs.service';
import { HttpStatus } from '../../../core/constants/http-statuses';

export async function deleteBlogHandler(req: Request<{ id: string }>, res: Response) {
    const result = await blogsService.deleteBlog(req.params.id);

    if (!result) {
        res.sendStatus(HttpStatus.NotFound);
    }

    res.sendStatus(HttpStatus.NoContent);
}
