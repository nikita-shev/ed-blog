import { Post, PostWithId } from '../types/posts.types';
import { PostInputDto } from '../dto';
import { postCollection } from '../../db/db.config';
import { ObjectId } from 'mongodb';

export const postsRepository = {
    async findPosts(): Promise<PostWithId[]> {
        return postCollection.find().toArray();
    },

    async findPostById(id: string): Promise<PostWithId | null> {
        return postCollection.findOne({ _id: new ObjectId(id) });
    },

    async createPost(data: Post): Promise<string> {
        const insertResult = await postCollection.insertOne(data);

        return insertResult.insertedId.toString();
    },

    async updatePost(id: string, data: PostInputDto): Promise<boolean> {
        const result = await postCollection.updateOne({ _id: new ObjectId(id) }, { $set: data });

        return result.matchedCount === 1;
    },

    async deletePost(id: string): Promise<boolean> {
        const result = await postCollection.deleteOne({ _id: new ObjectId(id) });

        return result.deletedCount === 1;
    }
};
