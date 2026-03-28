import { Request, Response, Router } from 'express';
import { BlogModel } from '../blogs/schema/schema';
import {
    commentCollection,
    postCollection,
    sessionsCollection,
    userCollection
} from '../../db/db.config';
import { HttpStatus } from '../../core/constants/http-statuses';

export const testingRouter = Router();

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await Promise.all([
        BlogModel.deleteMany(),
        postCollection.deleteMany(),
        userCollection.deleteMany(),
        commentCollection.deleteMany(),
        sessionsCollection.deleteMany()
    ]);

    res.sendStatus(HttpStatus.NoContent);
});
