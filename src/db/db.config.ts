import { Collection, MongoClient } from 'mongodb';
import { Blog } from '../blogs/types/blog.types';
import { Post } from '../posts/types/posts.types';
import dotenv from 'dotenv';

dotenv.config();

const mongoURL = process.env.MONGO_URL;

let client: MongoClient;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;

export async function runDB() {
    if (!mongoURL) {
        throw new Error('MongoDB URL is missing');
    }

    try {
        client = new MongoClient(mongoURL);
        const db = client.db('blog');

        blogCollection = db.collection<Blog>('blogs');
        postCollection = db.collection<Post>('posts');

        // await client.connect();
        // await db.command({ ping: 1 });

        console.log('✅ Connected to the database');
    } catch (e) {
        await client.close();
        throw new Error(`❌ Database not connected: ${e}`);
    }
}
