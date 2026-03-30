import { Request, Response, Router } from 'express';
import { BlogModel } from '../blogs/schema/schema';
import { PostModel } from '../posts/schema/schema';
import { CommentModel } from '../comments/schema/schema';
import { UserModel } from '../users/schema/schema';
import { sessionsCollection } from '../../db/db.config';
import { HttpStatus } from '../../core/constants/http-statuses';

export const testingRouter = Router();

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await Promise.all([
        BlogModel.deleteMany(),
        PostModel.deleteMany(),
        UserModel.deleteMany(),
        CommentModel.deleteMany(),
        sessionsCollection.deleteMany()
    ]);

    res.sendStatus(HttpStatus.NoContent);
});
