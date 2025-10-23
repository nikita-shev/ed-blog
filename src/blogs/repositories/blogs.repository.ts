import { Blog } from '../types/blog.types';
import { BlogInputDto } from '../dto';
import { db } from '../../db/db';

export const blogsRepository = {
    findBlog(): Blog[] {
        return db.blogs;
    },

    findBlogById(id: number): Blog | null {
        const blog = db.blogs.find((b) => b.id === id);

        if (!blog) {
            return null;
        }

        return blog;
    },

    createNewBlog(data: BlogInputDto): Blog {
        const newBlog: Blog = {
            id: +new Date(),
            ...data
        };

        db.blogs.push(newBlog);
        return newBlog;
    },

    updateBlog(id: number, data: BlogInputDto): boolean {
        const blog = db.blogs.find((b) => b.id === id);

        if (!blog) {
            return false;
        }

        for (let key in blog) {
            if (key in data) {
                // @ts-ignore
                blog[key] = data[key];
            }
        }
        return true;
    },

    deleteBlog(id: number): boolean {
        const blog = db.blogs.find((b) => b.id === id);

        if (!blog) {
            return false;
        }

        db.blogs = db.blogs.filter((b) => b.id !== id);
        return true;
    }
};
