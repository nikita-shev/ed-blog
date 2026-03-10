import { postsRepository } from '../repositories/posts.repository';
import { Post, PostWithId } from '../types/posts.types';
import { PostInputDto } from '../dto';
import { PostsSearchParams } from '../types/transaction.types';
import { SearchResult } from '../../core/types/dto.types';
import { PostFilters } from '../types/filter.types';
import { NullableServiceDto } from '../../core/utils/result-object/types/result-object.types';
import { createdResult, notFoundResult } from '../../core/utils/result-object';
import { commentRepository } from '../../routes/comments/repositories/comment.repository';
import {
    Comment,
    CommentatorInfo,
    CommentWithId
} from '../../routes/comments/types/comments.types';
import { CommentOutputDto } from '../../routes/comments/dto/comment.dto';

export const postsService = {
    async findPosts(
        params: PostsSearchParams, // TODO: rename
        filteringParams?: PostFilters // TODO: rename
    ): Promise<SearchResult<PostWithId>> {
        return postsRepository.findPosts(params, filteringParams);
    },

    async findPostById(id: string): Promise<PostWithId | null> {
        return postsRepository.findPostById(id);
    },

    async createPost(data: PostInputDto): Promise<PostWithId | null> {
        const { blogId, title, shortDescription, content } = data;
        const newPost: Post = {
            blogName: 'Test',
            createdAt: new Date().toISOString(),
            title,
            shortDescription,
            content,
            blogId
        };
        const postId = await postsRepository.createPost(newPost);

        return this.findPostById(postId); // TODO: 50/50
    },

    async updatePost(id: string, data: PostInputDto): Promise<boolean> {
        return postsRepository.updatePost(id, data);
    },

    async deletePost(id: string): Promise<boolean> {
        return postsRepository.deletePost(id);
    },

    async createComment(
        postId: string,
        content: string,
        commentatorInfo: CommentatorInfo
    ): Promise<NullableServiceDto<CommentOutputDto>> {
        const post = await this.findPostById(postId);

        if (!post) {
            // return createResultObject(null, ResultStatus.NotFound);
            return notFoundResult.create();
        }

        const newComment: Comment = {
            content,
            commentatorInfo,
            postId,
            createdAt: new Date().toISOString()
        };
        const commentId = await commentRepository.createComment(newComment); // TODO: именование. как правильно?
        const foundComment = await commentRepository.getCommentById(commentId); // TODO: избыточно?

        if (!foundComment) {
            // return createResultObject(null, ResultStatus.NotFound);
            return notFoundResult.create();
        }

        // return createResultObject(convertCommentData(result.data), ResultStatus.Created);
        return createdResult.create(convertCommentData(foundComment));
    }
};

// TODO: move, rename?
export function convertCommentData(comment: CommentWithId): CommentOutputDto {
    return {
        id: String(comment._id),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt
    };
}
