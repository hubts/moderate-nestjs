import { Paginated, PaginationOptions } from "src/shared/type";

export type FindManyAllModels<T> = () => Promise<Paginated<T>>;

export type FindManyPaginatedModels<T> = (
    options: PaginationOptions
) => Promise<Paginated<T>>;

export type FindManyPaginatedAndFilteredModels<T, R> = (
    options: PaginationOptions,
    where: R
) => Promise<Paginated<T>>;
