import { Router } from 'express';
import { authBearerMiddleware, authMiddleware } from '../../../core/middlewares/auth.middleware';
import { postInputDtoValidation } from '../middlewares/validation/post.input-dto.validation-middlewares';
import { inputValidationResultMiddleware } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { idValidation, validateId } from '../../../core/validation/id-validation';
import { queryValidationMiddlewares2 } from '../../blogs/middlewares/validation/blog.query.validation-middlewares';
import { commentInputDtoValidation } from '../middlewares/validation/input-dto-validation';
import { PostSortFields } from '../types/sorting.types';
import { CommentSortFields } from '../../comments/types/sorting.types';
import { container } from '../../../composition-root';
import { PostsController } from '../controller/posts.controller';

export const postsRouter = Router();
const postsController = container.get(PostsController);

postsRouter
    .get(
        '/',
        queryValidationMiddlewares2(PostSortFields),
        inputValidationResultMiddleware,
        postsController.getPosts.bind(postsController)
    )
    .get(
        '/:id',
        idValidation,
        inputValidationResultMiddleware,
        postsController.getPost.bind(postsController)
    )
    .get(
        '/:postId/comments',
        queryValidationMiddlewares2(CommentSortFields),
        inputValidationResultMiddleware,
        postsController.getCommentsForPost.bind(postsController)
    )
    .post(
        '/',
        authMiddleware,
        postInputDtoValidation,
        inputValidationResultMiddleware,
        postsController.createPost.bind(postsController)
    )
    .post(
        '/:postId/comments',
        authBearerMiddleware,
        validateId('postId'),
        commentInputDtoValidation,
        inputValidationResultMiddleware,
        postsController.createComment.bind(postsController)
    )
    .put(
        '/:id',
        authMiddleware,
        idValidation,
        postInputDtoValidation,
        inputValidationResultMiddleware,
        postsController.updatePost.bind(postsController)
    )
    .delete(
        '/:id',
        authMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        postsController.deletePost.bind(postsController)
    );
