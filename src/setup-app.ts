import express, { Express, NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { PATHS } from './core/constants/paths';
import { blogsRouter } from './routes/blogs/routers/blogs.router';
import { postsRouter } from './routes/posts/routers/posts.router';
import { usersRouter } from './routes/users/routers/users.router';
import { authRouter } from './routes/auth/routers/auth.router';
import { testingRouter } from './routes/testing/testing.router';
import { commentsRouter } from './routes/comments/routers/comments.router';
import { securityDevices } from './routes/securityDevices/routers/security-devices.router';

export function setupApp(app: Express) {
    app.use(express.json());
    app.use(cookieParser());

    app.use(PATHS.blogs, blogsRouter);
    app.use(PATHS.posts, postsRouter);
    app.use(PATHS.users, usersRouter);
    app.use(PATHS.auth, authRouter);
    app.use(PATHS.comments, commentsRouter);
    app.use(PATHS.securityDevices, securityDevices);
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
