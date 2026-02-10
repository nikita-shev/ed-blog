import { Collection, MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { Blog } from '../blogs/types/blog.types';
import { Post } from '../posts/types/posts.types';
import { User } from '../users/types/users.types';
import { Comment } from '../routes/comments/types/comments.types';
import { Session } from '../auth/types/sessions.types';
import { RateLimitDto } from '../core/application/rate-limit.service';

dotenv.config();

const mongoURL = process.env.MONGO_URL;

let client: MongoClient;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let userCollection: Collection<User>;
export let commentCollection: Collection<Comment>;
export let sessionsCollection: Collection<Session>;
export let rateLimitCollection: Collection<RateLimitDto>;

export async function runDB(dbUrl = mongoURL) {
    if (!dbUrl) {
        throw new Error('MongoDB URL is missing');
    }

    try {
        client = new MongoClient(dbUrl);
        const db = client.db();

        blogCollection = db.collection<Blog>('blogs');
        postCollection = db.collection<Post>('posts');
        userCollection = db.collection<User>('users');
        commentCollection = db.collection<Comment>('comment');
        sessionsCollection = db.collection<Session>('sessions');
        rateLimitCollection = db.collection<RateLimitDto>('rate-limit');

        // await client.connect();
        // await db.command({ ping: 1 });

        console.log('✅ Connected to the database');
    } catch (e) {
        await client.close();
        throw new Error(`❌ Database not connected: ${e}`);
    }
}

// TODO: fix
// export async function stopDB() {
//     if (!client) {
//         throw new ErrorTypes(`❌ No active client`);
//     }
//
//     await client.close();
// }
