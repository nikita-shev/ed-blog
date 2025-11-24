import { ExtensionType, ResultObject, ResultStatus } from '../result-object.types';

export function createResultObject<T>(
    data: T,
    status: ResultStatus = ResultStatus.Success,
    errorMessage: string = '',
    extensions: ExtensionType[] = []
): ResultObject<T> {
    return {
        status,
        errorMessage,
        extensions,
        data
    };
}
