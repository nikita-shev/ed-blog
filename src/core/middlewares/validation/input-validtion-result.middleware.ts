import { NextFunction, Request, Response } from 'express';
import { FieldValidationError, ValidationError, validationResult } from 'express-validator';
import { Error, ErrorsMessages } from '../../types/error.types';
import { HttpStatus } from '../../constants/http-statuses';

const formatError = (error: ValidationError): Error => {
    const expressError = error as unknown as FieldValidationError; // TODO: why?

    return {
        field: expressError.path,
        message: expressError.msg
    };
};

export function inputValidationResultMiddleware(
    req: Request<{}, {}, {}, {}>,
    res: Response,
    next: NextFunction
) {
    const errors = validationResult(req).formatWith(formatError).array({ onlyFirstError: true });

    if (errors.length > 0) {
        return res.status(HttpStatus.BadRequest).send({ errorsMessages: errors } as ErrorsMessages);
    }

    next();
}
