import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../constants/http-statuses';
import { jwtService } from '../application/jwt.service';
import { resultCodeToHttpException } from '../result-object/utils/resultCodeToHttpException';

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

export function authBearerMiddleware(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    const [authType, token] = auth.split(' ');

    if (authType !== 'Bearer') {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    const result = jwtService.checkToken(token);

    if (!result.data) {
        return res.sendStatus(resultCodeToHttpException(result.status));
        // return res.status(resultCodeToHttpException(result.status)).send({
        //     errorsMessages: result.extensions
        // });
    } else {
        req.appContext = { userId: result.data.userId };
        next();
    }
}
