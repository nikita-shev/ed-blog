import { inject, injectable } from 'inversify';
import { PostModel } from '../schema/schema';
import {
    createdResult,
    noContentResult,
    notFoundResult,
    successResult
} from '../../../core/utils/result-object';
import { mapPostData } from '../routers/mappers/mapPostData';
import { PostsRepository } from '../repositories/posts.repository';
import { PostInputDto, PostOutputDto } from '../dto';
import { PostsSearchParams } from '../types/transaction.types';
import { PaginationResult } from '../../../core/types/dto.types';
import { PostFilters } from '../types/filter.types';
import { ServiceDto } from '../../../core/utils/result-object/types/result-object.types';
import { CommentatorInfo } from '../../comments/types/comments.types';
import { CommentOutputDto } from '../../comments/dto/comment.dto';
import { CommentsService } from '../../comments/application/comments.service';

@injectable()
export class PostsService {
    constructor(
        @inject(PostsRepository) private postsRepository: PostsRepository,
        @inject(CommentsService) private commentsService: CommentsService
    ) {}

    async findPosts(
        params: PostsSearchParams, // TODO: rename
        filteringParams?: PostFilters // TODO: rename
    ): Promise<ServiceDto<PaginationResult<PostOutputDto>>> {
        const { items: posts, totalCount } = await this.postsRepository.findPosts(
            params,
            filteringParams
        );

        return successResult.create({ items: posts.map(mapPostData), totalCount });
    }

    async findPostById(id: string): Promise<ServiceDto<PostOutputDto | null>> {
        const result = await this.postsRepository.findPostById(id);

        return result ? successResult.create(mapPostData(result)) : notFoundResult.create(null);
    }

    async createPost(data: PostInputDto): Promise<ServiceDto<PostOutputDto | null>> {
        const { blogId, title, shortDescription, content } = data;
        const newPost = new PostModel({
            blogName: 'Test',
            createdAt: new Date().toISOString(),
            title,
            shortDescription,
            content,
            blogId
        });
        await this.postsRepository.save(newPost);
        const result = await this.findPostById(newPost.id);

        return result.data ? createdResult.create(result.data) : result;
    }

    async updatePost(id: string, data: PostInputDto): Promise<ServiceDto<boolean | null>> {
        const post = await this.postsRepository.findPostById(id);

        if (!post) return notFoundResult.create();

        post.title = data.title;
        post.shortDescription = data.shortDescription;
        post.content = data.content;
        post.blogId = data.blogId;
        await this.postsRepository.save(post);

        return noContentResult.create(true);
    }

    async deletePost(id: string): Promise<ServiceDto<boolean | null>> {
        const result = await this.postsRepository.deletePost(id);

        return result ? noContentResult.create(result) : notFoundResult.create();
    }

    async createComment(
        postId: string,
        content: string,
        commentatorInfo: CommentatorInfo
    ): Promise<ServiceDto<CommentOutputDto | null>> {
        const result = await this.findPostById(postId);
        if (!result.data) return notFoundResult.create(null);

        const resultOfCreatingComment = await this.commentsService.createComment(result.data.id, {
            content,
            commentatorInfo
        });
        if (!resultOfCreatingComment.data) return notFoundResult.create(null);

        return resultOfCreatingComment;
    }
}
