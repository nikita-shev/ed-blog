import { Router } from 'express';
import { authMiddleware } from '../../../core/middlewares/auth.middleware';
import { blogInputDtoValidation } from '../middlewares/validation/blog.input-dto.validation-middlewares';
import { inputValidationResultMiddleware } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { idValidation } from '../../../core/validation/id-validation';
import { queryValidationMiddlewares } from '../middlewares/validation/blog.query.validation-middlewares';
import { BlogSortFields } from '../types/sorting.types';
import { blogIdValidation } from '../middlewares/validation/blog.params.validation-middlewares';
import { postInputWithoutBlogIdDtoValidation } from '../../posts/middlewares/validation/post.input-dto.validation-middlewares';
import { blogsController } from '../../../composition-root';

export const blogsRouter = Router();

blogsRouter
    .get(
        '/',
        queryValidationMiddlewares(BlogSortFields),
        inputValidationResultMiddleware,
        blogsController.getBlogs.bind(blogsController)
    )
    .get(
        '/:blogId/posts',
        // blogIdValidation,
        // queryValidationMiddlewares2(BlogSortFields), // TODO: tests
        // inputValidationResultMiddleware,
        blogsController.getPostsForSpecificBlog.bind(blogsController)
    )
    .get(
        '/:id',
        idValidation,
        inputValidationResultMiddleware,
        blogsController.getBlog.bind(blogsController)
    )
    .post(
        '/',
        authMiddleware,
        blogInputDtoValidation,
        inputValidationResultMiddleware,
        blogsController.createBlog.bind(blogsController)
    )
    .post(
        '/:blogId/posts',
        authMiddleware,
        blogIdValidation,
        postInputWithoutBlogIdDtoValidation,
        inputValidationResultMiddleware,
        blogsController.createPostForSpecificBlog.bind(blogsController)
    )
    .put(
        '/:id',
        authMiddleware,
        idValidation,
        blogInputDtoValidation,
        inputValidationResultMiddleware,
        blogsController.updateBlog.bind(blogsController)
    )
    .delete(
        '/:id',
        authMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        blogsController.deleteBlog.bind(blogsController)
    );
