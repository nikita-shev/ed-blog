import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { PostsService } from '../application/posts.service';
import { AuthService } from '../../auth/application/auth.service';
import { CommentQueryRepository } from '../../comments/repositories/comment.query.repository';
import { resultCodeToHttpException } from '../../../core/utils/result-object/utils/resultCodeToHttpException';
import { createPaginationResult } from '../../../core/utils/pagination-result/pagination-result';
import { matchedData } from 'express-validator';
import { CommentInputDto } from '../dto/post.dto';
import { CommentOutputDto } from '../../comments/dto/comment.dto';
import { CommentatorInfo } from '../../comments/types/comments.types';
import { PostInputDto, PostOutputDto } from '../dto';
import { CommentsSearchParams } from '../../comments/types/transaction.types';
import { OutputDto } from '../../../core/types/dto.types';
import { PostsSearchParams, RequestQuery, ResponseBody } from '../types/transaction.types';

@injectable()
export class PostsController {
    constructor(
        @inject(PostsService) private postsService: PostsService,
        @inject(AuthService) private authService: AuthService,
        @inject(CommentQueryRepository) private commentQueryRepository: CommentQueryRepository
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
        const result = await this.postsService.createPost(req.body);
        const status = resultCodeToHttpException(result.status);

        if (!result.data) {
            return res.sendStatus(status);
        }

        res.status(status).send(result.data);
    }

    async deletePost(req: Request<{ id: string }>, res: Response) {
        const result = await this.postsService.deletePost(req.params.id);
        const status = resultCodeToHttpException(result.status);

        if (!result.data) {
            return res.sendStatus(status);
        }

        res.sendStatus(status);
    }

    async getCommentsForPost(
        req: Request<{ postId: string }, {}, {}, CommentsSearchParams>,
        res: Response<OutputDto<CommentOutputDto>>
    ) {
        const result = await this.postsService.findPostById(req.params.postId);
        const status = resultCodeToHttpException(result.status);

        if (!result.data) return res.sendStatus(status);

        const sanitizedQuery = matchedData<CommentsSearchParams>(req, {
            locations: ['query'],
            includeOptionals: true
        });
        const { data: comments, status: searchStatus } =
            await this.commentQueryRepository.getComments(req.params.postId, sanitizedQuery);

        res.status(resultCodeToHttpException(searchStatus)).send(comments);
    }

    async getPost(req: Request<{ id: string }>, res: Response<PostOutputDto>) {
        const result = await this.postsService.findPostById(req.params.id);
        const status = resultCodeToHttpException(result.status);

        if (!result.data) {
            return res.sendStatus(status);
        }

        return res.status(status).send(result.data);
    }

    async getPosts(req: RequestQuery, res: ResponseBody) {
        const sanitizedQuery = matchedData<PostsSearchParams>(req, {
            locations: ['query'],
            includeOptionals: true
        });

        const { data, status } = await this.postsService.findPosts(sanitizedQuery);
        const result = createPaginationResult(data, {
            pageNumber: sanitizedQuery.pageNumber,
            pageSize: sanitizedQuery.pageSize
        });

        res.status(resultCodeToHttpException(status)).send(result);
    }

    async updatePost(req: Request<{ id: string }, {}, PostInputDto>, res: Response<PostOutputDto>) {
        const result = await this.postsService.updatePost(req.params.id, req.body);
        const status = resultCodeToHttpException(result.status);

        if (!result.data) {
            return res.sendStatus(status);
        }

        res.sendStatus(status);
    }
}
