import { query } from 'express-validator';
import {
    pageNumberValidation,
    pageSizeValidation,
    sortByValidation,
    sortDirectionValidation
} from '../../../core/middlewares/validation/fields';

export function queryValidationMiddlewares<T extends string>(sortFieldsEnum: Record<string, T>) {
    const allowedSortFields = Object.values(sortFieldsEnum);

    const searchNameTermValidation = query('searchNameTerm').default('');

    return [
        pageNumberValidation,
        pageSizeValidation,
        searchNameTermValidation,
        sortByValidation(allowedSortFields),
        sortDirectionValidation()
    ];
}

// TODO: rename "queryValidationMiddlewares2"
export function queryValidationMiddlewares2<T extends string>(sortFieldsEnum: Record<string, T>) {
    const allowedSortFields = Object.values(sortFieldsEnum);

    return [
        pageNumberValidation,
        pageSizeValidation,
        sortByValidation(allowedSortFields),
        sortDirectionValidation()
    ];
}
