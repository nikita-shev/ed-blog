import { Blog, BlogWithId } from '../types/blog.types';
import { BlogInputDto } from '../dto';
import { blogCollection } from '../../db/db.config';
import { ObjectId } from 'mongodb';

export const blogsRepository = {
    async findBlogs(): Promise<BlogWithId[]> {
        return blogCollection.find().toArray();
    },

    async findBlogById(id: string): Promise<BlogWithId | null> {
        return blogCollection.findOne({ _id: new ObjectId(id) });
    },

    async createNewBlog(data: BlogInputDto): Promise<BlogWithId> {
        const newBlog: Blog = {
            createdAt: new Date().toISOString(),
            isMembership: false,
            ...data
        };

        const insertResult = await blogCollection.insertOne(newBlog);

        return { ...newBlog, _id: insertResult.insertedId };
    },

    async updateBlog(id: string, data: BlogInputDto): Promise<boolean> {
        const result = await blogCollection.updateOne({ _id: new ObjectId(id) }, { $set: data });

        return result.matchedCount === 1;
    },

    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });

        return result.deletedCount === 1;
    }
};
