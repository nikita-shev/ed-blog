import { Request, Response, Router } from 'express';
import { HttpStatus } from '../core/constants/http-statuses';
import { blogCollection, postCollection } from '../db/db.config';

export const testingRouter = Router();

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await Promise.all([blogCollection.deleteMany(), postCollection.deleteMany()]);

    res.sendStatus(HttpStatus.NoContent);
});
