import { Request, Response } from 'express';
import { PostOutputDto } from '../../dto';
import { HttpStatus } from '../../../core/constants/http-statuses';
import { postsRepository } from '../../repositories/posts.repository';
import { mapToPostOutput } from '../mappers/mapToPostOutput';

export async function getPostsHandler(req: Request, res: Response<PostOutputDto[]>) {
    const posts = await postsRepository.findPosts();

    res.status(HttpStatus.Ok).send(posts.map(mapToPostOutput));
}
