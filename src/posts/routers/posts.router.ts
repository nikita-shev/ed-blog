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
import { queryValidationMiddlewares } from '../../blogs/middlewares/validation/blog.query.validation-middlewares';
import { BlogSortFields } from '../../blogs/types/sorting.types';

export const postsRouter = Router();

// TODO: fix validation
postsRouter
    .get(
        '/',
        queryValidationMiddlewares(BlogSortFields), // queryValidationMiddlewares2
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
