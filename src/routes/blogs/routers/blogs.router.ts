import { Router } from 'express';
import {
    createBlogHandler,
    createPostForSpecificBlogHandler,
    deleteBlogHandler,
    getBlogHandler,
    getBlogsHandler,
    getPostsForSpecificBlogHandler,
    updateBlogHandler
} from './handlers';
import { authMiddleware } from '../../../core/middlewares/auth.middleware';
import { blogInputDtoValidation } from '../middlewares/validation/blog.input-dto.validation-middlewares';
import { inputValidationResultMiddleware } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { idValidation } from '../../../core/validation/id-validation';
import { queryValidationMiddlewares } from '../middlewares/validation/blog.query.validation-middlewares';
import { BlogSortFields } from '../types/sorting.types';
import { blogIdValidation } from '../middlewares/validation/blog.params.validation-middlewares';
import { postInputWithoutBlogIdDtoValidation } from '../../posts/middlewares/validation/post.input-dto.validation-middlewares';

export const blogsRouter = Router();

blogsRouter
    .get(
        '/',
        queryValidationMiddlewares(BlogSortFields),
        inputValidationResultMiddleware,
        getBlogsHandler
    )
    .get(
        '/:blogId/posts',
        // blogIdValidation,
        // queryValidationMiddlewares2(BlogSortFields), // TODO: tests
        // inputValidationResultMiddleware,
        getPostsForSpecificBlogHandler
    )
    .get('/:id', idValidation, inputValidationResultMiddleware, getBlogHandler)
    .post(
        '/',
        authMiddleware,
        blogInputDtoValidation,
        inputValidationResultMiddleware,
        createBlogHandler
    )
    .post(
        '/:blogId/posts',
        authMiddleware,
        blogIdValidation,
        postInputWithoutBlogIdDtoValidation,
        inputValidationResultMiddleware,
        createPostForSpecificBlogHandler
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
