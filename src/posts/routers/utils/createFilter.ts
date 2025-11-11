import { PostFilters } from '../../types/filter.types';

export function createFilter(filters: PostFilters | undefined) {
    return filters
        ? Object.fromEntries(
              Object.entries(filters).map(([key, value]) => [key, { $regex: value, $options: 'i' }])
          )
        : {};
}
