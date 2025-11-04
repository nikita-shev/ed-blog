import { Request, Response } from 'express';
import { PostInputDto, PostOutputDto } from '../../dto';
import { postsRepository } from '../../repositories/posts.repository';
import { HttpStatus } from '../../../core/constants/http-statuses';
import { mapToPostOutput } from '../mappers/mapToPostOutput';

export async function createPostHandler(
    req: Request<{}, {}, PostInputDto>,
    res: Response<PostOutputDto>
) {
    const post = await postsRepository.createPost(req.body);

    res.status(HttpStatus.Created).send(mapToPostOutput(post));
}
