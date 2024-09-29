import { ERROR_CODE, SuccessCode, SuccessName } from "../constant";

/**
 * @description
 * 성공/에러의 코드와 이름에 대한 타입 정의
 */
export type ErrorCode = keyof typeof ERROR_CODE;
export type ErrorName = typeof ERROR_CODE[ErrorCode];
export type ResponseCode = ErrorCode | typeof SuccessCode;
export type ResponseName = ErrorName | typeof SuccessName;

/**
 * @description
 * 성공/에러를 모두 포함하는 공통 응답에 대한 정의
 */
export interface CommonResponse<T> {
    success: boolean;
    code: ResponseCode;
    name: ResponseName;
    message: string;
    data: T | null;
}
