import { ApiResponse } from "@nestjs/swagger";
import { asErrorResponse } from "src/common/response/as-error-response";
import { ERROR } from "src/shared/constant";
import { CommonResponse, ErrorName } from "src/shared/type";

function groupErrorsByStatus(names: ErrorName[]): {
    [key: number]: ErrorName[];
} {
    const result: { [key: number]: ErrorName[] } = {};

    names.forEach((name: ErrorName) => {
        const status = ERROR[name].status;
        if (!result[status]) {
            result[status] = [];
        }
        result[status].push(name);
    });

    return result;
}

export const ApiResErrors = (names: ErrorName[]) => {
    const groupedErrorsObject = groupErrorsByStatus(names);
    const statuses = Object.keys(groupedErrorsObject).map(status =>
        Number(status)
    );

    return (
        target: object,
        key: string | symbol,
        descriptor: TypedPropertyDescriptor<any>
    ) => {
        statuses.forEach((status: number) => {
            ApiResponse({
                status,
                content: {
                    "application/json": {
                        examples: groupedErrorsObject[status].reduce(
                            (list, example) => {
                                const description = ERROR[example].description;
                                const errorResponse = asErrorResponse(example);
                                list[errorResponse.name] = {
                                    value: errorResponse,
                                    description: !!description
                                        ? typeof description === "string"
                                            ? description
                                            : (description as string[]).join(
                                                  "\n\n"
                                              )
                                        : errorResponse.message,
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
        });

        return descriptor;
    };
};
