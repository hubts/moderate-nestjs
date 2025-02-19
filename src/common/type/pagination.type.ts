import { Paginated, PaginationOptions } from "@sdk";

export type FindManyAllModels<T> = () => Promise<Paginated<T>>;

export type FindManyPaginatedModels<T> = (
    options: PaginationOptions
) => Promise<Paginated<T>>;

export type FindManyPaginatedAndFilteredModels<T, R> = (
    options: PaginationOptions,
    where: R
) => Promise<Paginated<T>>;
