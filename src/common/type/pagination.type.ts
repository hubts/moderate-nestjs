import {
    Paginated,
    PaginationOptions,
} from "src/shared/api/interface/pagination.interface";

export type FindManyAllModels<T> = () => Promise<Paginated<T>>;

export type FindManyPaginatedModels<T> = (
    options: PaginationOptions
) => Promise<Paginated<T>>;
