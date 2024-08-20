import { HttpException, HttpStatus } from "@nestjs/common";
import { CommonResponse } from "src/shared/api/interface/common-response.interface";
import { FailureName, asFailureResponse } from "src/shared/api/lib";

export interface ExpectedFailureResponse {
    statusCode: number;
    message: string;
    failureResponse: CommonResponse<null>;
}

export class ExpectedFailureException extends HttpException {
    constructor(
        name: FailureName,
        statusCode = HttpStatus.BAD_REQUEST,
        cause?: object
    ) {
        const failureResponse = asFailureResponse(name);
        const response: ExpectedFailureResponse = {
            statusCode,
            message: failureResponse.message,
            failureResponse,
        };
        super(response, statusCode, {
            cause,
        });
    }
}

export class ExpectedBadRequestException extends ExpectedFailureException {
    constructor(name: FailureName, cause?: object) {
        super(name, HttpStatus.BAD_REQUEST, cause);
    }
}

export class ExpectedNotFoundException extends ExpectedFailureException {
    constructor(name: FailureName, cause?: object) {
        super(name, HttpStatus.NOT_FOUND, cause);
    }
}

export class ExpectedInternalServerException extends ExpectedFailureException {
    constructor(name: FailureName, cause?: object) {
        super(name, HttpStatus.INTERNAL_SERVER_ERROR, cause);
    }
}
