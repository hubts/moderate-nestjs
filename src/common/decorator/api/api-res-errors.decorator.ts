import { ApiResponse } from "@nestjs/swagger";
import { CommonResponse, ERROR, ErrorName } from "@sdk";
import { asErrorResponse } from "src/common/response/as-error-response";

/**
 * Group errors by status.
 * @param names - Error names.
 * @returns Grouped error names by status (as key).
 */
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

/**
 * Decorator for API response errors.
 *
 * This function group errors, and generate API response for each status with the errors.
 * You can use this to define error examples for API response in swagger.
 */
export const ApiResErrors = (names: ErrorName[]) => {
    // Group errors by status.
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
