import { Post } from '../types/posts.types';
import { PostInputDto } from '../dto';

let db: Post[] = [
    {
        id: 1,
        blogId: 1,
        blogName: 'Test',
        title: 'Text',
        content: 'qwerty',
        shortDescription: 'Bla-bla-bla'
    }
];

export const postsRepository = {
    findPosts(): Post[] {
        return db;
    },

    findPostById(id: number): Post | null {
        const post = db.find((p) => p.id === id);

        if (!post) {
            return null;
        }

        return post;
    },

    createPost(data: PostInputDto): Post {
        const newPost: Post = { id: +new Date(), blogName: 'Test', ...data, blogId: +data.blogId };

        db.push(newPost);
        return newPost;
    },

    updatePost(id: number, data: PostInputDto): boolean {
        const post = db.find((p) => p.id === id);

        if (!post) {
            return false;
        }

        for (let key in post) {
            if (key in data) {
                // @ts-ignore
                post[key] = data[key];
            }
        }
        return true;
    },

    deletePost(id: number): boolean {
        const post = db.find((p) => p.id === id);

        if (!post) {
            return false;
        }

        db = db.filter((p) => p.id !== id);
        return true;
    }
};
