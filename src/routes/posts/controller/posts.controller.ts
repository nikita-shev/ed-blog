import { PostsService } from '../application/posts.service';
import { AuthService } from '../../auth/application/auth.service';
import { CommentQueryRepository } from '../../comments/repositories/comment.query.repository';
import { Request, Response } from 'express';
import { CommentInputDto } from '../dto/post.dto';
import { CommentOutputDto } from '../../comments/dto/comment.dto';
import { resultCodeToHttpException } from '../../../core/utils/result-object/utils/resultCodeToHttpException';
import { CommentatorInfo } from '../../comments/types/comments.types';
import { PostInputDto, PostOutputDto } from '../dto';
import { HttpStatus } from '../../../core/constants/http-statuses';
import { convertPostData, mapToPostOutput } from '../routers/mappers/mapToPostOutput';
import { CommentsSearchParams } from '../../comments/types/transaction.types';
import { OutputDto } from '../../../core/types/dto.types';
import { matchedData } from 'express-validator';
import { PostsSearchParams, RequestQuery, ResponseBody } from '../types/transaction.types';

export class PostsController {
    constructor(
        private postsService: PostsService,
        private authService: AuthService,
        private commentQueryRepository: CommentQueryRepository
    ) {}

    async createComment(
        req: Request<{ postId: string }, {}, CommentInputDto>,
        res: Response<CommentOutputDto>
    ) {
        const userId = req.appContext.userId as string;
        const userSearchResult = await this.authService.getInfoAboutUser(userId);

        if (!userSearchResult.data) {
            return res.sendStatus(resultCodeToHttpException(userSearchResult.status));
        }

        const userInfo: CommentatorInfo = { userId, userLogin: userSearchResult.data.login };
        const result = await this.postsService.createComment(
            req.params.postId,
            req.body.content,
            userInfo
        );
        const status = resultCodeToHttpException(result.status);

        if (!result.data) {
            return res.sendStatus(status);
        }

        res.status(status).send(result.data);
    }

    async createPost(req: Request<{}, {}, PostInputDto>, res: Response<PostOutputDto>) {
        const post = await this.postsService.createPost(req.body);

        if (!post) {
            return res.sendStatus(HttpStatus.NotFound);
        }

        res.status(HttpStatus.Created).send(convertPostData(post));
    }

    async deletePost(req: Request<{ id: string }>, res: Response) {
        const result = await this.postsService.deletePost(req.params.id);

        if (!result) {
            return res.sendStatus(HttpStatus.NotFound);
        }

        res.sendStatus(HttpStatus.NoContent);
    }

    async getCommentsForPost(
        req: Request<{ postId: string }, {}, {}, CommentsSearchParams>,
        res: Response<OutputDto<CommentOutputDto>>
    ) {
        const post = await this.postsService.findPostById(req.params.postId);

        if (!post) {
            return res.sendStatus(HttpStatus.NotFound);
        }

        const sanitizedQuery = matchedData<CommentsSearchParams>(req, {
            locations: ['query'],
            includeOptionals: true
        });
        const comments = await this.commentQueryRepository.getComments(
            req.params.postId,
            sanitizedQuery
        );

        res.status(HttpStatus.Success).send(comments);
    }

    async getPost(req: Request<{ id: string }>, res: Response<PostOutputDto>) {
        const post = await this.postsService.findPostById(req.params.id);

        if (!post) {
            // throw new Error('Post not found');
            return res.sendStatus(HttpStatus.NotFound);
        }

        return res.status(HttpStatus.Success).send(convertPostData(post)); // TODO: convertPostData
    }

    async getPosts(req: RequestQuery, res: ResponseBody) {
        const sanitizedQuery = matchedData<PostsSearchParams>(req, {
            locations: ['query'],
            includeOptionals: true
        });

        const posts = await this.postsService.findPosts(sanitizedQuery);
        const result = mapToPostOutput(posts, {
            pageNumber: sanitizedQuery.pageNumber,
            pageSize: sanitizedQuery.pageSize
        });

        res.status(HttpStatus.Success).send(result);
    }

    async updatePost(req: Request<{ id: string }, {}, PostInputDto>, res: Response<PostOutputDto>) {
        const result = await this.postsService.updatePost(req.params.id, req.body);

        if (!result) {
            return res.sendStatus(HttpStatus.NotFound);
        }

        res.sendStatus(HttpStatus.NoContent);
    }
}
