import { HttpStatus, RequestMethod, Type } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";
import { METHOD_METADATA } from "@nestjs/common/constants";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { SUCCESS_MESSAGE } from "src/shared/response/message/success-message";

export interface SuccessResOptions {
    message: string;
    dataGenericType?: Type | null;
    status?: HttpStatus;
    description?: string;
}

export const ResSuccess = (options: SuccessResOptions) => {
    const { message, dataGenericType, status, description } = options;
    return <T>(
        target: object,
        key: string | symbol,
        descriptor: TypedPropertyDescriptor<T>
    ) => {
        // Set extra models
        if (!dataGenericType) {
            ApiExtraModels(SuccessResponseDto)(target, key, descriptor);
        } else {
            ApiExtraModels(SuccessResponseDto, dataGenericType)(
                target,
                key,
                descriptor
            );
        }

        // Get http method
        let statusCode = HttpStatus.OK;
        if (descriptor.value) {
            const httpMethod = Reflect.getMetadata(
                METHOD_METADATA,
                descriptor.value
            ) as RequestMethod;
            switch (httpMethod) {
                case RequestMethod.GET:
                    statusCode = HttpStatus.OK;
                    break;
                case RequestMethod.POST:
                    statusCode = HttpStatus.CREATED;
                    break;
                default:
                    statusCode = HttpStatus.OK;
            }
        }

        // Set response
        ApiResponse({
            status: status ?? statusCode,
            description: description ?? SUCCESS_MESSAGE.DEFAULT,
            content: {
                "application/json": {
                    schema: {
                        allOf: [
                            {
                                $ref: getSchemaPath(SuccessResponseDto),
                            },
                            {
                                properties: {
                                    message: {
                                        example: message,
                                    },
                                    data: !!dataGenericType
                                        ? {
                                              $ref: getSchemaPath(
                                                  dataGenericType
                                              ),
                                          }
                                        : { example: null },
                                },
                            },
                        ],
                    },
                },
            },
        })(target, key, descriptor);

        return descriptor;
    };
};
