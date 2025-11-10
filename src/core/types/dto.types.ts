export interface OutputDto<T> {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: T[];
}

// TODO: rename "DataDto"
export interface SearchResult<T> {
    items: T[];
    totalCount: number;
}
