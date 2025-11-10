import { Request, Response } from 'express';
import { blogsService } from '../../application/blogs.service';
import { BlogInputDto } from '../../dto';
import { HttpStatus } from '../../../core/constants/http-statuses';

export async function updateBlogHandler(
    req: Request<{ id: string }, {}, BlogInputDto>,
    res: Response
) {
    const result = await blogsService.updateBlog(req.params.id, req.body);

    if (!result) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    res.sendStatus(HttpStatus.NoContent);
}
