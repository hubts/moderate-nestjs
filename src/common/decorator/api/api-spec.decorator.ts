import { Get, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ApiRouteOptions, ErrorName } from "src/shared";
import { JwtRolesAuth } from "../auth/jwt-roles-auth.decorator";
import { ApiResErrors } from "./api-res-errors.decorator";
import {
    ApiResSuccess,
    ApiResSuccessOptions,
} from "./api-res-success.decorator";
import { ExpectedErrorException } from "src/common/error/expected-error.exception";

/**
 * Option interface of API specification.
 *
 * @param summary - Summary of the API.
 * @param method - HTTP method of the API (optional).
 * @param deprecated - Whether the API is deprecated (optional).
 * @param success - Options for the successful API response (optional).
 * @param errors - Error names for the API response (optional).
 */
export interface ApiSpecOptions {
    summary: string;
    method?: "GET" | "POST";
    deprecated?: boolean;
    success?: ApiResSuccessOptions;
    errors?: ErrorName[];
}

/**
 * Decorators for API specification.
 *
 * This decorator is a wrapper of NestJS decorators for API specification.
 * This decorator includes API route, JWT roles, success response, and error response.
 * You can use this to define API specification for each method in controllers.
 * See the examples of usage in any controllers.
 *
 * @param options {ApiSpecOptions} - Options for the API specification.
 *
 * Below are the options inherited from 'ApiRouteOptions' which defines API route.
 * @param subRoute - Sub-route of the API.
 * @param roles - Required roles for the API.
 * @param description - Description of the API.
 */
export const ApiSpec = <R>(
    options: ApiSpecOptions & Partial<ApiRouteOptions<R>>
): MethodDecorator => {
    const {
        method,
        subRoute,
        description,
        roles,
        summary,
        deprecated,
        success,
    } = options;
    const errors = options.errors ?? [];

    return <T>(
        target: object,
        key: string | symbol,
        descriptor: TypedPropertyDescriptor<T>
    ) => {
        // Set HTTP method.
        let HttpMethod = Get;
        switch (method) {
            case "GET": {
                HttpMethod = Get;
                break;
            }
            case "POST": {
                HttpMethod = Post;
                break;
            }
            default: {
                throw new ExpectedErrorException("NOT_IMPLEMENTED");
            }
        }
        HttpMethod(subRoute)(target, key, descriptor);

        // Set JWT roles.
        JwtRolesAuth(roles)(target, key, descriptor);
        if (roles?.length) {
            // If roles(permissions) are required, set errors related to access.
            // 401, 403
            errors.push("UNAUTHORIZED", "FORBIDDEN_RESOURCE");
        }

        // Set API operation.
        ApiOperation({
            operationId: key.toString(),
            summary,
            description: description?.length ? description.join("\n\n") : "",
            deprecated: deprecated ?? false,
        })(target, key, descriptor);

        // Set pre-defined success response.
        if (success) {
            ApiResSuccess(success)(target, key, descriptor);
        }

        // Set default errors.
        // 400, 500, 503
        errors.push(
            "BAD_REQUEST",
            "INTERNAL_SERVER_ERROR",
            "SERVICE_UNAVAILABLE"
        );
        // Set pre-defined error responses.
        if (errors?.length) {
            ApiResErrors(errors)(target, key, descriptor);
        }

        // Return.
        return descriptor;
    };
};
