import { Blog } from '../types/blog.types';
import { BlogInputDto } from '../dto';

let blogs: Blog[] = [
    { id: 1, name: 'Test Blog', description: 'Test desc', websiteUrl: 'https://google.com' }
];

export const blogsRepository = {
    findBlog(): Blog[] {
        return blogs;
    },

    findBlogById(id: number): Blog | null {
        const blog = blogs.find((b) => b.id === id);

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

        blogs.push(newBlog);
        return newBlog;
    },

    updateBlog(id: number, data: BlogInputDto): boolean {
        const blog = blogs.find((b) => b.id === id);

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
        const blog = blogs.find((b) => b.id === id);

        if (!blog) {
            return false;
        }

        blogs = blogs.filter((b) => b.id !== id);
        return true;
    }
};
