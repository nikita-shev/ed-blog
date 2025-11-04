import { BlogWithId } from '../../types/blog.types';
import { BlogOutputDto } from '../../dto';

export function mapToBlogOutput(blog: BlogWithId): BlogOutputDto {
    return {
        id: String(blog._id),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    };
}
