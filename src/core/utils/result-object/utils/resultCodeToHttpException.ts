import { ResultStatus } from '../types/result-object.types';
import { HttpStatus } from '../../../constants/http-statuses';

export function resultCodeToHttpException(resultCode: ResultStatus): number {
    return HttpStatus[resultCode];
}
