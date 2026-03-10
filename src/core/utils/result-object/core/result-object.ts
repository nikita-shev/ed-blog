import { ExtensionType, ServiceDto, ResultStatus } from '../types/result-object.types';

// TODO: добавить во всех местах, где используется createResultObject, сообщения об ошибках
// export function createResultObject<T>(
//     data: T,
//     status: ResultStatus = ResultStatus.Success,
//     errorMessage: string = '',
//     extensions: ExtensionType[] = []
// ): ResultObject<T> {
//     return {
//         status,
//         errorMessage,
//         extensions,
//         data
//     };
// }

// class ======>

interface IResultObject {
    create<T>(data: T, errorMessage: string, extensions: ExtensionType[]): ServiceDto<T>;
}

class ResultObject implements IResultObject {
    constructor(protected status: ResultStatus) {}

    create<T>(data: T, errorMessage: string = '', extensions: ExtensionType[] = []): ServiceDto<T> {
        return {
            status: this.status,
            errorMessage,
            extensions,
            data
        };
    }
}

export class SuccessResult extends ResultObject {
    constructor(protected status: ResultStatus) {
        super(status);
    }

    create<T>(data: T): ServiceDto<T> {
        return super.create(data);
    }
}

export class CreatedResult extends ResultObject {
    constructor(protected status: ResultStatus) {
        super(status);
    }

    create<T>(data: T): ServiceDto<T> {
        return super.create(data);
    }
}

export class NotFoundResult extends ResultObject {
    constructor(protected status: ResultStatus) {
        super(status);
    }

    create<T = null>(data: T = null as unknown as T): ServiceDto<T> {
        return super.create(data);
    }
}

export class NoContentResult extends ResultObject {
    constructor(protected status: ResultStatus) {
        super(status);
    }

    create<T = null>(data: T = null as unknown as T): ServiceDto<T> {
        return super.create(data);
    }
}

export class ForbiddenResult extends ResultObject {
    constructor(protected status: ResultStatus) {
        super(status);
    }

    create<T = null>(data: T = null as unknown as T): ServiceDto<T> {
        return super.create(data);
    }
}

export class UnauthorizedResult extends ResultObject {
    constructor(protected status: ResultStatus) {
        super(status);
    }

    create<T = null>(data: T = null as unknown as T): ServiceDto<T> {
        return super.create(data);
    }
}

export class BadRequestResult extends ResultObject {
    constructor(protected status: ResultStatus) {
        super(status);
    }

    create<T>(data: T, errorMessage: string, extensions: ExtensionType[] = []): ServiceDto<T> {
        return super.create(data, errorMessage, extensions);
    }
}

export class TooManyReqResult extends ResultObject {
    constructor(protected status: ResultStatus) {
        super(status);
    }

    create<T>(data: T): ServiceDto<T> {
        return super.create(data);
    }
}
