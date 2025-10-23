import { Post } from '../types/posts.types';
import { PostInputDto } from '../dto';
import { db } from '../../db/db';

export const postsRepository = {
    findPosts(): Post[] {
        return db.posts;
    },

    findPostById(id: number): Post | null {
        const post = db.posts.find((p) => p.id === id);

        if (!post) {
            return null;
        }

        return post;
    },

    createPost(data: PostInputDto): Post {
        const newPost: Post = { id: +new Date(), blogName: 'Test', ...data, blogId: +data.blogId };

        db.posts.push(newPost);
        return newPost;
    },

    updatePost(id: number, data: PostInputDto): boolean {
        const post = db.posts.find((p) => p.id === id);

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
        const post = db.posts.find((p) => p.id === id);

        if (!post) {
            return false;
        }

        db.posts = db.posts.filter((p) => p.id !== id);
        return true;
    }
};
