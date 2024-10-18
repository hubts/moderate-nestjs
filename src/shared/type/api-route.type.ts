/**
 * API route options for each method.
 */
export interface ApiRouteOptions<R> {
    subRoute: string; // Sub route path (e.g. /${pathPrefix}/${subRoute}).
    roles: R[]; // Roles to handle permission.
    description: string[]; // Description for the method.
}

/**
 * Typed API route for client request service (e.g. Controller in NestJS).
 * You can implemented a controller with this type.
 */
export type ApiRoute<T, R> = {
    apiTags: string;
    pathPrefix: string;
} & {
    // Method names are keys of T.
    [key in keyof T]: ApiRouteOptions<R>;
};
