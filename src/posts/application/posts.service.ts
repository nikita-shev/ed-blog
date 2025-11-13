import { postsRepository } from '../repositories/posts.repository';
import { Post, PostWithId } from '../types/posts.types';
import { PostInputDto } from '../dto';
import { PostsSearchParams } from '../types/transaction.types';
import { SearchResult } from '../../core/types/dto.types';
import { PostFilters } from '../types/filter.types';

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
    }
};
