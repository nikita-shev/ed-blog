import { OutputDto } from '../../../src/core/types/dto.types';

// TODO: for blogs. fix
export function mapData<T>(data: T[], pageSize: number = 10, pageNumber: number = 1): OutputDto<T> {
    return {
        items: data.slice((pageNumber - 1) * pageSize, pageSize * pageNumber),
        page: pageNumber,
        pageSize,
        pagesCount: Math.ceil(data.length / pageSize),
        totalCount: data.length
    };
}
