import { ExtensionType, ResultObject, ResultStatus } from '../result-object.types';

// TODO: добавить во всех местах, где используется createResultObject, сообщения об ошибках
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

// class ======>
// class ResultObjectTest {
//     create<T = null>(
//         data: T,
//         status: ResultStatus = ResultStatus.Success,
//         errorMessage: string = '',
//         extensions: ExtensionType[] = []
//     ): ResultObject<T> {
//         return {
//             status,
//             errorMessage,
//             extensions,
//             data
//         };
//     }
// }
// const resultObject = new ResultObjectTest();
//
// resultObject.create()

