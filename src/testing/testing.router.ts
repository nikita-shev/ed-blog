import { Request, Response, Router } from 'express';
import { HttpStatus } from '../core/constants/http-statuses';
import { db } from '../db/db';

export const testingRouter = Router();

testingRouter.delete('/all-data', (req: Request, res: Response) => {
    db.blogs = [];
    db.posts = [];

    res.sendStatus(HttpStatus.NoContent);
});
