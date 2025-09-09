import { ERROR_CODE, SuccessCode, SuccessName } from "../constant";

/**
 * Type definition for success/error code and name
 */
export type ErrorCode = keyof typeof ERROR_CODE;
export type ErrorName = (typeof ERROR_CODE)[ErrorCode];
export type ResponseCode = ErrorCode | typeof SuccessCode;
export type ResponseName = ErrorName | typeof SuccessName;

/**
 * Type definition of common response.
 * The server returns this type of response for all requests.
 */
export interface CommonResponse<T = null> {
    success: boolean;
    code: ResponseCode;
    name: ResponseName;
    message: string;
    data: T | null;
}
