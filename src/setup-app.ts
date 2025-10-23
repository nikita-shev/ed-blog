import express, { Express, Request, Response } from 'express';
import { PATHS } from './core/constants/paths';
import { blogsRouter } from './blogs/routers/blogs.router';

export function setupApp(app: Express) {
    app.use(express.json());

    app.use(PATHS.blogs, blogsRouter);

    app.get('/', (req: Request, res: Response) => {
        res.status(200).json('Hello World!');
    });
}
