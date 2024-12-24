import { HttpException } from "@nestjs/common";
import { asErrorResponse } from "src/common/response/as-error-response";
import { ERROR } from "src/shared/constant";
import { ErrorName } from "src/shared/type";

export class ExpectedErrorException extends HttpException {
    constructor(
        name: ErrorName,
        cause?: { case?: string } & Record<string, any>,
        detail?: string
    ) {
        const status = ERROR[name].status;
        const errorResponse = asErrorResponse(name);
        if (detail) {
            errorResponse.message += ` (Detail: ${detail})`;
        }
        super(errorResponse, status, {
            cause,
        });
    }
}
