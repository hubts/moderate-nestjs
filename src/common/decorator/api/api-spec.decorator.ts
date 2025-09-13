import {
    All,
    Delete,
    Get,
    Head,
    Options,
    Patch,
    Post,
    Put,
    RequestMethod,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { ApiMethodOptions, ErrorName } from "@sdk";
import { JwtRolesAuth } from "../auth/jwt-roles-auth.decorator";
import { ApiResErrors } from "./api-res-errors.decorator";
import {
    ApiResSuccess,
    ApiResSuccessOptions,
} from "./api-res-success.decorator";
import { ExpectedErrorException } from "src/common/error/expected-error.exception";

/**
 * Option interface of API specification.
 * @param summary - Summary of the API.
 * @param deprecated - Whether the API is deprecated (optional).
 * @param success - Options for the successful API response (optional).
 * @param errors - Error names for the API response (optional).
 */
export interface ApiSpecOptions {
    summary: string;
    deprecated?: boolean;
    request?: ApiRequestOptions;
    success?: ApiResSuccessOptions;
    errors?: ErrorName[];
}

/**
 * Option interface of API request for 'example'.
 * @param body - Request body example.
 * @param query - Request query example.
 * @param param - Request param example.
 */
export interface ApiRequestOptions {
    body?: any;
    query?: any;
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
 * @param options {ApiMethodOptions<R>} - Options for the API method.
 */
export const ApiSpec = <R>(
    options: ApiSpecOptions & ApiMethodOptions<R>
): MethodDecorator => {
    const {
        method,
        path,
        description,
        roles,
        summary,
        deprecated,
        success,
        request,
    } = options;
    const errors = options.errors ?? [];

    return <T>(
        target: object,
        key: string | symbol,
        descriptor: TypedPropertyDescriptor<T>
    ) => {
        // Set HTTP method.
        const methodToDecorator: {
            [key: number]: (path?: string | string[]) => MethodDecorator;
        } = {
            [RequestMethod.ALL]: All,
            [RequestMethod.GET]: Get,
            [RequestMethod.POST]: Post,
            [RequestMethod.PUT]: Put,
            [RequestMethod.DELETE]: Delete,
            [RequestMethod.PATCH]: Patch,
            [RequestMethod.OPTIONS]: Options,
            [RequestMethod.HEAD]: Head,
        };
        const HttpMethod = methodToDecorator[method];
        if (!HttpMethod) {
            throw new ExpectedErrorException("NOT_IMPLEMENTED");
        }
        HttpMethod(path)(target, key, descriptor);

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

        // Set request body.
        if (request?.body) {
            ApiBody({ schema: { example: request.body } })(
                target,
                key,
                descriptor
            );
        }

        // Set request query.
        if (request?.query) {
            ApiQuery({ schema: { example: request.query } })(
                target,
                key,
                descriptor
            );
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
