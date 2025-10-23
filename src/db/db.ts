import { Blog } from '../blogs/types/blog.types';
import { Post } from '../posts/types/posts.types';

export const db = {
    blogs: <Blog[]>[
        { id: 1, name: 'Test Blog', description: 'Test desc', websiteUrl: 'https://google.com' }
    ],
    posts: <Post[]>[
        {
            id: 1,
            blogId: 1,
            blogName: 'Test',
            title: 'Text',
            content: 'qwerty',
            shortDescription: 'Bla-bla-bla'
        }
    ]
};
