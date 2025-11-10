import { Post, PostWithId } from '../types/posts.types';
import { PostInputDto } from '../dto';
import { postsRepository } from '../repositories/posts.repository';

export const postsService = {
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
    }
};
