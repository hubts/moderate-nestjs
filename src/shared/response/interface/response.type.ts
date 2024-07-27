import { FAILURE_MESSAGE } from "../message/failure-message";
import { RESPONSE_CODE } from "../response.code";

// 응답 코드 및 응답 이름에 대한 타입 지정
export type ResponseCode = keyof typeof RESPONSE_CODE;
export type ResponseName = typeof RESPONSE_CODE[ResponseCode];

// 성공 응답 코드 및 이름에 대한 타입 지정
export const SuccessCode = "1000";
export const SuccessName = RESPONSE_CODE[SuccessCode];

// 실패 응답 코드 및 이름에 대한 타입 지정
type ExcludeStringLiteral<T, U extends string> = T extends U ? never : T; // Help type
export type FailureCode = ExcludeStringLiteral<
    ResponseCode,
    typeof SuccessCode
>;
export type FailureName = ExcludeStringLiteral<
    ResponseName,
    typeof SuccessName
>;

// 실패 응답 이름 목록
export const FailureNames = Object.keys(FAILURE_MESSAGE) as FailureName[];

// 실패 이름의 반환에 대한 타입 지정
export type ReturnFailure<T extends FailureName> = T;
