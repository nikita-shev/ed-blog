import { Router } from 'express';
import {
    createPostHandler,
    deletePostHandler,
    getPostHandler,
    getPostsHandler,
    updatePostHandler
} from './handlers';
import { authBearerMiddleware, authMiddleware } from '../../../core/middlewares/auth.middleware';
import { postInputDtoValidation } from '../middlewares/validation/post.input-dto.validation-middlewares';
import { inputValidationResultMiddleware } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { idValidation, validateId } from '../../../core/validation/id-validation';
import { queryValidationMiddlewares2 } from '../../blogs/middlewares/validation/blog.query.validation-middlewares';
import { createCommentHandler } from './handlers/create-comment.handler';
import { getCommentsForPost } from './handlers/get-comments-for-post';
import { commentInputDtoValidation } from '../middlewares/validation/input-dto-validation';
import { PostSortFields } from '../types/sorting.types';
import { CommentSortFields } from '../../comments/types/sorting.types';

export const postsRouter = Router();

postsRouter
    .get(
        '/',
        queryValidationMiddlewares2(PostSortFields),
        inputValidationResultMiddleware,
        getPostsHandler
    )
    .get('/:id', idValidation, inputValidationResultMiddleware, getPostHandler)
    .get(
        '/:postId/comments',
        queryValidationMiddlewares2(CommentSortFields),
        inputValidationResultMiddleware,
        getCommentsForPost
    )
    .post(
        '/',
        authMiddleware,
        postInputDtoValidation,
        inputValidationResultMiddleware,
        createPostHandler
    )
    .post(
        '/:postId/comments',
        authBearerMiddleware,
        validateId('postId'),
        commentInputDtoValidation,
        inputValidationResultMiddleware,
        createCommentHandler
    )
    .put(
        '/:id',
        authMiddleware,
        idValidation,
        postInputDtoValidation,
        inputValidationResultMiddleware,
        updatePostHandler
    )
    .delete(
        '/:id',
        authMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        deletePostHandler
    );
