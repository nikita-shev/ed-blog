import { BlogWithId } from '../../types/blog.types';
import { BlogOutputDto } from '../../dto';
import { OutputDto, SearchResult } from '../../../../core/types/dto.types';
import { BlogsSearchParams } from '../../types/transaction.types';

type ParamsType = Pick<BlogsSearchParams, 'pageSize' | 'pageNumber'>;

export function convertBlogData(blog: BlogWithId): BlogOutputDto {
    return {
        id: String(blog._id),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    };
}

export function mapToBlogOutput(
    data: SearchResult<BlogWithId>,
    params: ParamsType
): OutputDto<BlogOutputDto> {
    const { items, totalCount } = data;
    const { pageNumber: page, pageSize } = params;
    const blogs = items.map(convertBlogData);

    return {
        pagesCount: Math.ceil(totalCount / pageSize),
        page,
        pageSize,
        totalCount,
        items: blogs
    };
}
