import { Collection, MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import { Session } from '../routes/auth/types/sessions.types';
import { RateLimitDto } from '../core/application/rate-limit.service';

const mongoURL = process.env.MONGO_URL;

let client: MongoClient;
export let sessionsCollection: Collection<Session>;
export let rateLimitCollection: Collection<RateLimitDto>;
// TODO: rename collections: blogCollection => BlogCollection or BlogModelClass

export async function runDB(dbUrl = mongoURL) {
    if (!dbUrl) {
        throw new Error('MongoDB URL is missing');
    }

    // try {
    //     await mongoose.connect(dbUrl);
    //
    //     console.log('✅ Connected to the database');
    // } catch (e) {
    //     await mongoose.disconnect();
    //     throw new Error(`❌ Database not connected: ${e}`);
    // }

    try {
        await mongoose.connect(dbUrl);

        client = new MongoClient(dbUrl);
        const db = client.db();

        sessionsCollection = db.collection<Session>('sessions');
        rateLimitCollection = db.collection<RateLimitDto>('rate-limit');

        // await client.connect();
        // await db.command({ ping: 1 });

        console.log('✅ Connected to the database');
    } catch (e) {
        await client.close();

        await mongoose.disconnect();

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
