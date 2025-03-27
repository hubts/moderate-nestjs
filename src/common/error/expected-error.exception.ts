import { HttpException } from "@nestjs/common";
import { asErrorResponse } from "src/common/response/as-error-response";
import { ERROR } from "@sdk";
import { ErrorName } from "@sdk";

/**
 * [ 예상되는 에러 예외 ]
 * 서버에서 정의한, 예상되는 에러들을 처리하는 클래스
 * 미리 정의된 ErrorName 을 기반으로 에러를 생성한다.
 *
 * @param name - 예상되는 에러 이름
 * @param cause - 에러 발생 원인 (Object 형태로 원하는 추적데이터를 추가)
 * @param detail - 에러 발생 상세 메시지 (에러 메시지 뒤에 Concat)
 */
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
