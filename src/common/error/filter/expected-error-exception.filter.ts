import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { Request, Response } from "express";
import { CommonResponse } from "src/shared/type";
import { CustomLogger } from "../../logger/custom.logger";
import { ExpectedErrorException } from "../exception/expected-error.exception";

@Catch(ExpectedErrorException)
export class ExpectedErrorExceptionFilter
    implements ExceptionFilter<ExpectedErrorException>
{
    constructor(private logger: CustomLogger) {}

    catch(exception: ExpectedErrorException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const path = `${request.method} ${request.url}`;

        const status = exception.getStatus();
        const message = exception.message;
        const cause = exception.cause;
        const exceptionResponse = <CommonResponse<null>>exception.getResponse();

        // Error log saved, however, does not print by silent mode.
        this.logger.error(
            message,
            JSON.stringify({
                statusCode: status,
                request: {
                    path,
                    token: request.headers?.authorization,
                    body: request.body,
                },
                response: exceptionResponse,
                cause,
            }),
            path,
            false
            // status !== HttpStatus.INTERNAL_SERVER_ERROR
        );

        // Return
        response.status(status).json({
            success: exceptionResponse.success,
            message: exceptionResponse.message,
            code: exceptionResponse.code,
            name: exceptionResponse.name,
            data: exceptionResponse.data,
            // TODO: TEST EXTENSION
            extension: {
                cause,
            },
        });
    }
}
