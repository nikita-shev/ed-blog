import express, { Express, Request, Response } from 'express';
import { PATHS } from './core/constants/paths';
import { blogsRouter } from './blogs/routers/blogs.router';
import { postsRouter } from './posts/routers/posts.router';
import { testingRouter } from './testing/testing.router';

export function setupApp(app: Express) {
    app.use(express.json());

    app.use(PATHS.blogs, blogsRouter);
    app.use(PATHS.posts, postsRouter);
    app.use(PATHS.testing, testingRouter);

    app.get('/', (req: Request, res: Response) => {
        res.status(200).json('Hello World!');
    });
}
