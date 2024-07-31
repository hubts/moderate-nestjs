import { ApiOperation } from "@nestjs/swagger";
import { ResSuccess, SuccessResOptions } from "./res-success.decorator";
import { FailureResOptions, ResFailure } from "./res-failure.decorator";

interface ApiSpecOptions {
    summary: string;
    description?: string[];
    deprecated?: boolean;
    success?: SuccessResOptions;
    failures?: FailureResOptions[];
}

export const ApiSpec = (options: ApiSpecOptions): MethodDecorator => {
    const { summary, description, deprecated, success, failures } = options;

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

        // Set success response
        if (success) {
            ResSuccess(success)(target, key, descriptor);
        }

        // Set failures response
        if (failures?.length) {
            failures.forEach(failure => {
                ResFailure(failure)(target, key, descriptor);
            });
        }

        return descriptor;
    };
};
