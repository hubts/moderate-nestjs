/**
 * API route for client-request-service ()
 */
export type ApiRoute<T, R> = {
    apiTags: string;
    pathPrefix: string;
} & {
    // Method names
    [key in keyof T]: {
        subRoute: string; // Sub route path
        roles: R[]; // Roles for permission
        description: string[]; // Description for the method
    };
};
