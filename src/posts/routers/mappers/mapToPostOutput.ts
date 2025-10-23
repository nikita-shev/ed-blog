import { Post } from '../../types/posts.types';
import { PostOutputDto } from '../../dto';

export function mapToPostOutput(post: Post): PostOutputDto {
    return {
        id: `${post.id}`,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: `${post.blogId}`,
        blogName: post.blogName
    };
}
