import { Request, Response } from 'express';
import { PostInputDto, PostOutputDto } from '../../dto';
import { postsService } from '../../application/posts.service';
import { HttpStatus } from '../../../core/constants/http-statuses';
import { mapToPostOutput, convertPostData } from '../mappers/mapToPostOutput';

export async function createPostHandler(
    req: Request<{}, {}, PostInputDto>,
    res: Response<PostOutputDto>
) {
    const post = await postsService.createPost(req.body);

    if (!post) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    res.status(HttpStatus.Created).send(convertPostData(post));
}
