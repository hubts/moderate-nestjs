import { SuccessCode, SuccessName } from "src/shared/constant";
import { CommonResponse } from "src/shared/type";

/**
 * @description
 * 성공 메시지와 데이터를 통해 성공 응답을 생성하는 함수.
 *
 * @param message - 성공 메시지.
 * @param data - 성공 반환 데이터, 있는 경우 Generic 타입, 없는 경우 null.
 * @returns - 공통 응답 타입을 가진 성공 응답.
 */
export const asSuccessResponse = <T>(
    message: string,
    data: T | null = null
): CommonResponse<T> => {
    return {
        success: true,
        code: SuccessCode,
        name: SuccessName,
        message,
        data,
    };
};
