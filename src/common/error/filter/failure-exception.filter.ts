import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { CustomLogger } from "../../logger/custom.logger";
import {
    ExpectedFailureException,
    ExpectedFailureResponse,
} from "../exception/expected-failure.exception";

@Catch(ExpectedFailureException)
export class FailureExceptionFilter
    implements ExceptionFilter<ExpectedFailureException>
{
    constructor(private logger: CustomLogger) {}

    catch(exception: ExpectedFailureException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const path = `${request.method} ${request.url}`;

        const status = exception.getStatus();
        const message = exception.message;
        const cause = exception.cause;
        const exceptionResponse = <ExpectedFailureResponse>(
            exception.getResponse()
        );
        const failure = exceptionResponse.failureResponse;

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
                response: failure,
                cause,
            }),
            path,
            status !== HttpStatus.INTERNAL_SERVER_ERROR
        );

        // Return
        response.status(status).json({
            success: failure.success,
            message: failure.message,
            code: failure.code,
            name: failure.name,
            data: failure.data,
        });
    }
}
