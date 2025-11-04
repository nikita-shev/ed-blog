import { Request, Response, Router } from 'express';
import { HttpStatus } from '../core/constants/http-statuses';
import { blogCollection, postCollection } from '../db/db.config';

export const testingRouter = Router();

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await blogCollection.deleteMany();
    await postCollection.deleteMany();

    res.sendStatus(HttpStatus.NoContent);
});
