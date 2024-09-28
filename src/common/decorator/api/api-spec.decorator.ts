import { ApiOperation } from "@nestjs/swagger";
import { ErrorName } from "src/shared/type";
import { ApiResErrors } from "./api-res-errors.decorator";
import {
    ApiResSuccess,
    ApiResSuccessOptions,
} from "./api-res-success.decorator";

interface ApiSpecOptions {
    summary: string;
    description?: string[];
    deprecated?: boolean;
    success?: ApiResSuccessOptions;
    errors?: ErrorName[];
}

export const ApiSpec = (options: ApiSpecOptions): MethodDecorator => {
    const { summary, description, deprecated, success, errors } = options;

    return <T>(
        target: object,
        key: string | symbol,
        descriptor: TypedPropertyDescriptor<T>
    ) => {
        // Set API operation
        ApiOperation({
            operationId: key.toString(),
            summary,
            description: description?.length ? description.join("\n\n") : "",
            deprecated: deprecated ?? false,
        })(target, key, descriptor);

        // Set success schema as response example
        if (success) {
            ApiResSuccess(success)(target, key, descriptor);
        }

        // Set errors schema as response example
        if (errors?.length) {
            ApiResErrors(errors)(target, key, descriptor);
        }

        return descriptor;
    };
};
