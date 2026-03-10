import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../constants/http-statuses';
import { jwtService } from '../application/jwt.service';
import { resultCodeToHttpException } from '../utils/result-object/utils/resultCodeToHttpException';
import { RateLimitInputDto, rateLimitService } from '../application/rate-limit.service';

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

// =======================================>
// TODO: fix, rename
export async function authRateLimitWriteMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const data: RateLimitInputDto = {
        ip: req.ip ?? '',
        url: req.originalUrl,
        date: new Date().toISOString()
    };

    await rateLimitService.saveData(data);
    next();
}

// TODO: fix, rename
export async function authRateLimitReedMiddleware(req: Request, res: Response, next: NextFunction) {
    const result = await rateLimitService.getData(req.originalUrl, req.ip ?? '');

    if (!result.data) {
        return res.sendStatus(HttpStatus.TooManyRequests);
    } else {
        next();
    }
}

// TODO: Add test for /auth/registration (rate limit 429 error): authRateLimitReedMiddleware and authRateLimitWriteMiddleware
// TODO: Add test for /auth/registration (валидация входных данных)
