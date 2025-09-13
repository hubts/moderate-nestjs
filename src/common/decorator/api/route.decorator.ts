import { ApiMethodOptions } from "@sdk";
import { RequestMethod } from "@nestjs/common";
import { ApiSpec, ApiSpecOptions } from "./api-spec.decorator";

type RouteFactory = {
    [K in keyof typeof RequestMethod as Exclude<K, number> extends string
        ? Capitalize<Lowercase<Exclude<K, number>>>
        : never]: <R>(
        methodOptions: ApiMethodOptions<R>,
        specOptions: ApiSpecOptions
    ) => MethodDecorator;
};

const createRouteFactory = (): RouteFactory => {
    const route = {} as RouteFactory;
    Object.keys(RequestMethod)
        .filter(key => isNaN(Number(key)))
        .forEach(key => {
            const capitalized = (key.charAt(0) +
                key.slice(1).toLowerCase()) as keyof RouteFactory;
            // @ts-expect-error: dynamic assignment with computed key
            route[capitalized] = <R>(
                methodOptions: ApiMethodOptions<R>,
                specOptions: ApiSpecOptions
            ) =>
                ApiSpec<R>({
                    ...methodOptions,
                    ...specOptions,
                    method: (RequestMethod as any)[key] as RequestMethod,
                });
        });
    return route;
};

/**
 * Defined API specification for each HTTP method.
 */
export const Route: RouteFactory = createRouteFactory();
