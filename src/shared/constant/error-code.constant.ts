/**
 * @description
 * 에러 코드 및 에러 이름 정의
 * 도메인별로 다루는 에러를 분류하여 지정하면 편리합니다.
 */
export const ERROR_CODE = {
    // AUTH / USER
    "4001": "DUPLICATE_EMAIL",
    "4002": "DUPLICATE_NICKNAME",
    "4003": "DUPLICATE_MOBILE",
    "4004": "WRONG_PASSWORD",
    "4005": "SAME_PASSWORD",
    "4006": "UNREGISTERED_EMAIL",
    "4007": "USER_NOT_FOUND",
    "4008": "INVALID_REFRESH_TOKEN",
    "4009": "UNAUTHORIZED_ACCESS",
    "4010": "PROFILE_NOT_FOUND",

    // EXTERNAL
    // 예를 들어, DB 저장 에러 또는 외부 서버 연동 시 에러를 지정할 수 있습니다.
    "5000": "UNEXPECTED_ERROR",
    "5001": "DATA_SOURCE_ERROR",
    "5002": "EXTERNAL_SERVER_ERROR",
} as const;
