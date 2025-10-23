import { Blog } from '../../types/blog.types';
import { BlogOutputDto } from '../../dto';

export function mapToBlogOutput(blog: Blog): BlogOutputDto {
    return {
        id: `${blog.id}`,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl
    };
}
