import { HttpStatus } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { CommonResponse } from "src/shared/api/interface/common-response.interface";
import { FailureName, asFailureResponse } from "src/shared/api/lib";

interface FailureExample {
    name: FailureName;
    description?: string;
}

export interface FailureResOptions {
    status: HttpStatus;
    examples: FailureExample[];
    description?: string;
}

export const ResFailure = (options: FailureResOptions) => {
    const { status, examples, description } = options;
    return (
        target: object,
        key: string | symbol,
        descriptor: TypedPropertyDescriptor<any>
    ) => {
        ApiResponse({
            status,
            description: description ?? `${status} Error occurs.`,
            content: {
                "application/json": {
                    examples: examples.reduce(
                        (list, example) => {
                            const failure = asFailureResponse(example.name);
                            list[failure.name] = {
                                value: failure,
                                description:
                                    example.description ?? failure.message,
                            };
                            return list;
                        },
                        {} as {
                            [key: string]: {
                                value: CommonResponse<null>;
                                description: string;
                            };
                        }
                    ),
                },
            },
        })(target, key, descriptor);

        return descriptor;
    };
};
