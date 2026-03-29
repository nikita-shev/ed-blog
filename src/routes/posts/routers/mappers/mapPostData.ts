import { PostWithId } from '../../types/posts.types';
import { PostOutputDto } from '../../dto';

export function mapPostData(post: PostWithId): PostOutputDto {
    return {
        id: String(post._id),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    };
}
