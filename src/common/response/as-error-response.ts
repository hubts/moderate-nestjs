import { ERROR, ERROR_CODE } from "@sdk";
import { CommonResponse, ErrorCode, ErrorName } from "@sdk";

/**
 * @description
 * 에러 이름을 통해 에러 응답을 생성하는 함수.
 *
 * @param name - 에러 이름 (ErrorName).
 * @returns - 공통 응답 타입을 가진 에러 응답.
 */
export const asErrorResponse = (name: ErrorName): CommonResponse<null> => {
    const code = String(
        Object.entries(ERROR_CODE).find(([, val]) => val === name)?.[0] ?? 0
    ) as ErrorCode;
    const error = ERROR[name];
    return {
        success: false,
        code,
        name: (name as string).replaceAll("_", " ").toLowerCase() as ErrorName,
        message: error.message,
        data: null,
    };
};
