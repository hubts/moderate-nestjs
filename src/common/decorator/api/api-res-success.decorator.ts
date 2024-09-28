import { HttpStatus, RequestMethod, Type } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";
import { METHOD_METADATA } from "@nestjs/common/constants";
import { SUCCESS_MESSAGE } from "src/shared/constant";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";

export interface ApiResSuccessOptions {
    message: string;
    dataGenericType?: Type | null;
    status?: HttpStatus;
    description?: string;
}

export const ApiResSuccess = (options: ApiResSuccessOptions) => {
    const { message, dataGenericType, status, description } = options;
    return <T>(
        target: object,
        key: string | symbol,
        descriptor: TypedPropertyDescriptor<T>
    ) => {
        // Set extra models
        if (dataGenericType) {
            ApiExtraModels(dataGenericType)(target, key, descriptor);
        }

        /**
         * Get http method
         * (주의!) 여기서 Reflect.getMetadata로 HTTP 메소드를 가져오려면,
         * 이 데코레이터보다 더 하단에 @Get, @Post 등의 데코레이터가 위치해야 합니다.
         */
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
