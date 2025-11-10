import { Router } from 'express';
import {
    createBlogHandler,
    deleteBlogHandler,
    getBlogHandler,
    getBlogsHandler,
    updateBlogHandler
} from './handlers';
import { authMiddleware } from '../../auth/middlewares/auth.middleware';
import { blogInputDtoValidation } from '../middlewares/validation/blog.input-dto.validation-middlewares';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { idValidation } from '../../core/validation/id-validation';
import { queryValidationMiddlewares } from '../middlewares/validation/blog.query.validation-middlewares';
import { BlogSortFields } from '../types/sorting.types';

export const blogsRouter = Router();

blogsRouter
    .get(
        '/',
        queryValidationMiddlewares(BlogSortFields),
        inputValidationResultMiddleware,
        getBlogsHandler
    )
    .get('/:id', idValidation, inputValidationResultMiddleware, getBlogHandler)
    .post(
        '/',
        authMiddleware,
        blogInputDtoValidation,
        inputValidationResultMiddleware,
        createBlogHandler
    )
    .put(
        '/:id',
        authMiddleware,
        idValidation,
        blogInputDtoValidation,
        inputValidationResultMiddleware,
        updateBlogHandler
    )
    .delete(
        '/:id',
        authMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        deleteBlogHandler
    );
