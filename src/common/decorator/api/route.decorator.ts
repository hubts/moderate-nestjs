import { ApiRouteOptions } from "@sdk";
import { ApiSpec, ApiSpecOptions } from "./api-spec.decorator";

/**
 * Defined API specification for each HTTP method.
 */
export const Route = {
    Get: <R>(route: Partial<ApiRouteOptions<R>>, options: ApiSpecOptions) =>
        ApiSpec<R>({ ...route, ...options, method: "GET" }),
    Post: <R>(route: Partial<ApiRouteOptions<R>>, options: ApiSpecOptions) =>
        ApiSpec<R>({ ...route, ...options, method: "POST" }),
};
