import { query } from 'express-validator';
import { basicQueryParamsValidationMiddleware } from '../../../../core/middlewares/validation/query-params-validation';
import { UserSortFields } from '../../../types/sorting.types';

const searchLoginTermValidation = query('searchLoginTerm').default(null);
const searchEmailTermValidation = query('searchEmailTerm').default(null);

export const usersQueryValidation = [
    ...basicQueryParamsValidationMiddleware(UserSortFields),
    searchLoginTermValidation,
    searchEmailTermValidation
];
