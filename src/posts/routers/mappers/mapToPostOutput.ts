import { PostWithId } from '../../types/posts.types';
import { PostOutputDto } from '../../dto';
import { OutputDto, SearchResult } from '../../../core/types/dto.types';
import { PostsSearchParams } from '../../types/transaction.types';

type ParamsType = Pick<PostsSearchParams, 'pageSize' | 'pageNumber'>;

export function convertPostData(post: PostWithId): PostOutputDto {
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

export function mapToPostOutput(
    data: SearchResult<PostWithId>,
    params: ParamsType
): OutputDto<PostOutputDto> {
    const { items, totalCount } = data;
    const { pageNumber: page, pageSize } = params;
    const posts = items.map(convertPostData);

    return {
        pagesCount: Math.ceil(totalCount / pageSize),
        page,
        pageSize,
        totalCount,
        items: posts
    };
}
