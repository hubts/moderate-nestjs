export interface PaginationOptions {
    skip: number;
    take: number;
}

export interface Paginated<T> {
    total: number; // Total size of all data (Total limit)
    size: number; // Size of data list (Smaller or equal than 'take')
    list: T[]; // Data list
}
