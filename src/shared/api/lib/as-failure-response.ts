import { RESPONSE_CODE } from "../constant/response-code.constant";
import { FAILURE_MESSAGE } from "../constant/failure-message.constant";
import { CommonResponse } from "../interface/common-response.interface";
import { FailureCode, FailureName } from "./response.type-helper";

/**
 * 실패 이름에 해당하는 실패 응답 객체를 반환합니다.
 * @param {FailureName} name - 실패 이름
 * @returns 실패 응답 객체
 */
export const asFailureResponse = (name: FailureName): CommonResponse<null> => {
    const code = String(
        Object.entries(RESPONSE_CODE).find(([, val]) => val === name)?.[0] ?? 0
    ) as FailureCode;
    const message = FAILURE_MESSAGE[name];
    return {
        success: false,
        code,
        name: (name as string)
            .replaceAll("_", " ")
            .toLowerCase() as FailureName,
        message,
        data: null,
    };
};
