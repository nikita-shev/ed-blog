import { OutputDto, PaginationResult } from '../../types/dto.types';
import { BasicSearchParams } from '../../types/search-params.types';

type TParams = Pick<BasicSearchParams, 'pageSize' | 'pageNumber'>;

export function createPaginationResult<T extends object>(
    data: PaginationResult<T>,
    params: TParams
): OutputDto<T> {
    const { items, totalCount } = data;
    const { pageNumber: page, pageSize } = params;

    return {
        pagesCount: Math.ceil(totalCount / pageSize),
        page,
        pageSize,
        totalCount,
        items
    };
}
