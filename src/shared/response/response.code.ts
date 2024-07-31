/**
 * @description
 * Response code (응답 코드)에는 예측하지 못한 에러를 제외하고 모든 응답 값에 대한 커스텀 코드를 지정합니다.
 * 응답은 성공, 실패, 예측한 에러로 구분될 수 있으며, 해당 구분 내에서 코드 대역을 설정하여 새로운 코드들을 지정하도록 합니다.
 * (주의!) 서버에서 예측한(Handled) 에러 또한 공통적으로 실패로 간주하여 용어를 이용합니다.
 */
export const RESPONSE_CODE = {
    // 성공의 경우, 공통적으로 1000을 사용합니다.
    "1000": "SUCCESS",

    // 아래는 실패의 경우를 지정합니다.
    // 도메인별로 다루는 실패를 분류하여 지정하면 편리합니다.
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

    // 아래는 예측한 에러의 경우를 지정합니다.
    // 예를 들어, DB 저장 에러 또는 외부 서버 연동 시 에러를 지정할 수 있습니다.
    "5000": "UNEXPECTED_ERROR",
    "5001": "DATA_SOURCE_ERROR",
} as const;
