import { FailureName } from "../lib/response.type-helper";

/**
 * @description
 * 실패 및 예측 에러 응답 코드에 대응하는 메시지를 설정합니다.
 */
export const FAILURE_MESSAGE: {
    [key in FailureName]: string;
} = {
    // Failure
    DUPLICATE_EMAIL: "This email already exists.",
    DUPLICATE_NICKNAME: "This nickname already exists.",
    DUPLICATE_MOBILE: "This mobile already exists.",
    WRONG_PASSWORD: "This is wrong password.",
    SAME_PASSWORD: "This password is same as before.",
    UNREGISTERED_EMAIL: "This email is not registered.",
    USER_NOT_FOUND: "The user does not exist.",
    INVALID_REFRESH_TOKEN: "The refresh token is not valid.",
    UNAUTHORIZED_ACCESS: "Unauthorized access. Please try in a different way.",
    PROFILE_NOT_FOUND: "The profile does not exist.",
    // ERROR
    UNEXPECTED_ERROR: "Unexpected error occurs. Please try again.",
    DATA_SOURCE_ERROR: "Error occurs in data source. Please try again.",
};
