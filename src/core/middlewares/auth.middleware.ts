import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../constants/http-statuses';

const USERNAME = 'admin';
const PASSWORD = 'qwerty';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    const [authType, token] = auth?.split(' ');
    if (authType !== 'Basic') {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    const credentials = Buffer.from(token, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    if (username !== USERNAME || password !== PASSWORD) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    next();
}
