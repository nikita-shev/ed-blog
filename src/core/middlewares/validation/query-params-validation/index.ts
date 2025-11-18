import {
    pageNumberValidation,
    pageSizeValidation,
    sortByValidation,
    sortDirectionValidation
} from './fields';

export function basicQueryParamsValidationMiddleware<T extends string>(sortFieldsEnum: Record<string, T>) {
    const allowedSortFields = Object.values(sortFieldsEnum);

    return [
        pageNumberValidation,
        pageSizeValidation,
        sortByValidation(allowedSortFields),
        sortDirectionValidation()
    ];
}
