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

export const blogsRouter = Router();

blogsRouter
    .get('/', getBlogsHandler)
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
