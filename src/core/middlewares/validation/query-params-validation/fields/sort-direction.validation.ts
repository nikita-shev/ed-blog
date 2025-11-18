import { query } from 'express-validator';
import { SortDirection } from '../../../../types/sorting.types';

export function sortDirectionValidation() {
    const sortDirection = Object.values(SortDirection);

    return query('sortDirection')
        .default(sortDirection[0])
        .isIn(sortDirection)
        .withMessage(`Sort direction must be one of: ${sortDirection.join(', ')}`);
}
