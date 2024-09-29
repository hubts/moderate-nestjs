import { HttpException } from "@nestjs/common";
import { asErrorResponse } from "src/common/response/as-error-response";
import { ERROR } from "src/shared/constant";
import { ErrorName } from "src/shared/type";

export class ExpectedErrorException extends HttpException {
    constructor(name: ErrorName, cause?: object) {
        const status = ERROR[name].status;
        const errorResponse = asErrorResponse(name);
        super(errorResponse, status, {
            cause,
        });
    }
}
