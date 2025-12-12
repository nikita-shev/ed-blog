import express, { Express, NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { PATHS } from './core/constants/paths';
import { blogsRouter } from './blogs/routers/blogs.router';
import { postsRouter } from './posts/routers/posts.router';
import { testingRouter } from './testing/testing.router';
import { usersRouter } from './users/routers/users.router';
import { authRouter } from './auth/routers/auth.router';
import { commentsRouter } from './routes/comments/routers/comments.router';

export function setupApp(app: Express) {
    app.use(express.json());
    app.use(cookieParser());

    app.use(PATHS.blogs, blogsRouter);
    app.use(PATHS.posts, postsRouter);
    app.use(PATHS.users, usersRouter);
    app.use(PATHS.auth, authRouter);
    app.use(PATHS.comments, commentsRouter);
    app.use(PATHS.testing, testingRouter);

    app.use(errorHandler); // TODO: fix

    app.get('/', (req: Request, res: Response) => {
        res.status(200).json('Hello World!');
    });
}

function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    // TODO: fix

    if (err instanceof Error) {
        return res.sendStatus(404);
    }

    next(err);
}
