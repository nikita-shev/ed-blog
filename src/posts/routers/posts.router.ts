import { Router } from 'express';
import {
    getPostHandler,
    getPostsHandler,
    createPostHandler,
    updatePostHandler,
    deletePostHandler
} from './handlers';
import { authMiddleware } from '../../auth/middlewares/auth.middleware';
import { postInputDtoValidation } from '../middlewares/validation/post.input-dto.validation-middlewares';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { idValidation } from '../../core/validation/id-validation';

export const postsRouter = Router();

postsRouter
    .get('/', getPostsHandler)
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
