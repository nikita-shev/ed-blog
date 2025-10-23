import { Request, Response } from 'express';
import { PostOutputDto } from '../../dto';
import { postsRepository } from '../../repositories/posts.repository';
import { HttpStatus } from '../../../core/constants/http-statuses';
import { mapToPostOutput } from '../mappers/mapToPostOutput';

export function getPostHandler(req: Request<{ id: string }>, res: Response<PostOutputDto>) {
    const post = postsRepository.findPostById(+req.params.id);

    if (!post) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    return res.status(HttpStatus.Ok).send(mapToPostOutput(post));
}
