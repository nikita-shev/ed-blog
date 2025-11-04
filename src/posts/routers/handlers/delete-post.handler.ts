import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/posts.repository';
import { HttpStatus } from '../../../core/constants/http-statuses';

export async function deletePostHandler(req: Request<{ id: string }>, res: Response) {
    const result = await postsRepository.deletePost(req.params.id);

    if (!result) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    res.sendStatus(HttpStatus.NoContent);
}
