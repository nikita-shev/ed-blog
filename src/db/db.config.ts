import { Collection, MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { Blog } from '../routes/blogs/types/blog.types';
import { Post } from '../routes/posts/types/posts.types';
import { User } from '../routes/users/types/users.types';
import { Comment } from '../routes/comments/types/comments.types';
import { Session } from '../routes/auth/types/sessions.types';
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
// TODO: rename collections: blogCollection => BlogCollection or BlogModelClass

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

// interface CollectionDB {
//     type: "Blog" | "Post" | "User" | "Comment" | "Session" | "RateLimitDto";
//     // type: string;
//     name: string;
// }
// interface CollectionSchemas {
//     blogs: Blog;
//     posts: Post;
//     users: User;
//     comment: Comment;
//     sessions: Session;
//     'rate-limit': RateLimitDto;
// }
// interface ConfigItem<K extends keyof CollectionSchemas> {
//     type: K;
//     name: string;
// }
// class MongoDb {
//     private client: MongoClient;
//     private collections: CollectionDB[] = [];
//     public collectionSchemas: { [k: string]: any } = {}; // итоговый вариант коллекций
//
//     constructor(private url: string) {
//         this.client = new MongoClient(this.url);
//     }
//
//     private checkUrl() {
//         if (!this.url) {
//             throw new Error('MongoDB URL is missing');
//         }
//     }
//
//     addCollections(arr: CollectionDB[]) {
//         this.collections.push(...arr);
//     }
//
//     async connect() {
//         this.checkUrl();
//
//         try {
//             const db = this.client.db();
//
//             this.collections.forEach((collection) => {
//                 const { type, name } = collection;
//
//                 this.collectionSchemas[`${name}Collection`] =
//                     db.collection<typeof type>(name);
//             });
//
//             console.log('✅ Connected to the database');
//         } catch (error) {
//             await this.client.close();
//             throw new Error(`❌ Database not connected: ${error}`);
//         }
//     }
// }
//
// const mongoDb = new MongoDb(mongoURL ?? '');
// const collections: CollectionDB[] = [{ type: 'Blog' as const, name: 'blogs' }];
// mongoDb.addCollections(collections);
