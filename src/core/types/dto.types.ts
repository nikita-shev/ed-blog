// TODO: rename "OutputDto"
export interface OutputDto<T> {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: T[];
}

// TODO: delete "SearchResult"
export interface SearchResult<T> {
    items: T[];
    totalCount: number;
}
export interface PaginationResult<T> {
    items: T[];
    totalCount: number;
}
