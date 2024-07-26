import { RESPONSE_CODE } from "../constant/response.code";

// Type of response code and name
export type ResponseCode = keyof typeof RESPONSE_CODE;
export type ResponseName = typeof RESPONSE_CODE[ResponseCode];

// Type of success response code and name
export const SuccessCode = "1000";
export const SuccessName = RESPONSE_CODE[SuccessCode];

// Type of failure response code and name
type ExcludeStringLiteral<T, U extends string> = T extends U ? never : T; // Help type
export type FailureCode = ExcludeStringLiteral<
    ResponseCode,
    typeof SuccessCode
>;
export type FailureName = ExcludeStringLiteral<
    ResponseName,
    typeof SuccessName
>;
