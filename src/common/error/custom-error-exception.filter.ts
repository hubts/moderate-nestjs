import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { CustomLogger } from "../logger/custom.logger";
import { ExpectedErrorException } from "./expected-error.exception";
import { ErrorCode, ERROR_CODE, ErrorName, CommonResponse } from "src/shared";

/**
 * [ 에러 처리 필터 ]
 * 발생하는 모든 에러를 처리하는 필터
 */
@Catch()
export class CustomErrorExceptionFilter implements ExceptionFilter {
    constructor(private logger: CustomLogger) {
        logger.setContext(CustomErrorExceptionFilter.name);
    }

    catch(error: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const path = `${request.method} ${request.url}`;

        // Unexpected throwing error
        if (!(error instanceof ExpectedErrorException)) {
            // If the error is an instance of HttpException
            if (error instanceof HttpException) {
                // Convert HttpException to ExpectedErrorException
                const code = `${error.getStatus()}`;
                const errorCode = Object.keys(ERROR_CODE).find(
                    key => key === code
                ) as ErrorCode;
                const errorName = ERROR_CODE[errorCode] as ErrorName;
                if (errorName) {
                    // Defined error with HTTP code
                    error = new ExpectedErrorException(errorName, error);
                } else {
                    // Undefined error with HTTP code
                    error = new ExpectedErrorException(
                        "INTERNAL_SERVER_ERROR",
                        error,
                        error.message
                    );
                }
            } else {
                error = new ExpectedErrorException(
                    "INTERNAL_SERVER_ERROR",
                    error,
                    error.message
                );
            }
        }

        // Now, 'error' is an instance of ExpectedErrorException
        const exception = error as ExpectedErrorException;
        const status = exception.getStatus();
        const message = exception.message;
        const stack = exception.stack;
        const cause = exception.cause;
        const exceptionResponse = <CommonResponse<null>>exception.getResponse();

        // Error log
        this.logger.errorMore(message, {
            ...(stack && { stack }),
            context: path,
            detail: {
                save: true,
                request: {
                    path,
                    token: request.headers?.authorization,
                    body: request.body,
                },
                response: exceptionResponse,
                cause: cause as object,
            },
        });

        // Return
        response.status(status).json({
            ...exceptionResponse,
            // TODO: below is TEST EXTENSION
            extension: {
                timestamp: new Date().toISOString(),
                request: {
                    path,
                    ...(request.headers?.authorization && {
                        token: request.headers.authorization,
                    }),
                    ...(request.body &&
                        !request.body && { body: request.body }),
                },
                cause,
            },
        });
    }
}
