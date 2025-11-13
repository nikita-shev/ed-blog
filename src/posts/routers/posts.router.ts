import { Router } from 'express';
import {
    createPostHandler,
    deletePostHandler,
    getPostHandler,
    getPostsHandler,
    updatePostHandler
} from './handlers';
import { authMiddleware } from '../../auth/middlewares/auth.middleware';
import { postInputDtoValidation } from '../middlewares/validation/post.input-dto.validation-middlewares';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { idValidation } from '../../core/validation/id-validation';
import { queryValidationMiddlewares2 } from '../../blogs/middlewares/validation/blog.query.validation-middlewares';
import { PostSortFields } from '../types/sorting.types';

export const postsRouter = Router();

postsRouter
    .get(
        '/',
        queryValidationMiddlewares2(PostSortFields),
        inputValidationResultMiddleware,
        getPostsHandler
    )
    .get('/:id', idValidation, inputValidationResultMiddleware, getPostHandler)
    .post(
        '/',
        authMiddleware,
        postInputDtoValidation,
        inputValidationResultMiddleware,
        createPostHandler
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
