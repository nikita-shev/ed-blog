import { Request, Response } from 'express';
import { PostInputDto, PostOutputDto } from '../../dto';
import { postsRepository } from '../../repositories/posts.repository';
import { HttpStatus } from '../../../core/constants/http-statuses';

export function updatePostHandler(
    req: Request<{ id: string }, {}, PostInputDto>,
    res: Response<PostOutputDto>
) {
    const result = postsRepository.updatePost(+req.params.id, req.body);

    if (!result) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    res.sendStatus(HttpStatus.NoContent);
}
