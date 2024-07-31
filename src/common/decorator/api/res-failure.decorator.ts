import { HttpStatus } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { IResponse } from "src/shared/response/interface/response.interface";
import { FailureName } from "src/shared/response/interface/response.type";
import { asFailureResponse } from "src/shared/response/util/as-failure-response";

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
                                value: IResponse<null>;
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
