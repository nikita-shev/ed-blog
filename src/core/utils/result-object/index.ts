import { ResultStatus } from './types/result-object.types';
import {
    BadRequestResult,
    CreatedResult,
    ForbiddenResult,
    NoContentResult,
    NotFoundResult,
    SuccessResult,
    TooManyReqResult,
    UnauthorizedResult
} from './core/result-object';

export const successResult = new SuccessResult(ResultStatus.Success);
export const createdResult = new CreatedResult(ResultStatus.Created);
export const notFoundResult = new NotFoundResult(ResultStatus.NotFound);
export const noContentResult = new NoContentResult(ResultStatus.NoContent);
export const forbiddenResult = new ForbiddenResult(ResultStatus.Forbidden);
export const unauthorizedResult = new UnauthorizedResult(ResultStatus.Unauthorized);
export const badRequestResult = new BadRequestResult(ResultStatus.BadRequest);
export const tooManyReqResult = new TooManyReqResult(ResultStatus.TooManyRequests);
