/**
 * @description
 * 에러 코드 및 에러 이름 정의
 * 도메인별로 다루는 에러를 분류하여 지정하면 편리합니다.
 */
export const ERROR_CODE = {
    /**
     * 기본적인 에러
     */
    "400": "BAD_REQUEST", // 클라이언트 요청 오류 (예를 들어, 파라미터 오류 등)
    "401": "UNAUTHORIZED", // 인증 오류 (예를 들어, 로그인 필요 등)
    "403": "FORBIDDEN_RESOURCE", // 리소스 접근 권한 없음
    "500": "INTERNAL_SERVER_ERROR", // 서버 내부 에러 (예를 들어, DB 에러 등)
    "503": "SERVICE_UNAVAILABLE", // 서비스 이용 불가 (또는 외부 서버 응답불가 등)

    /**
     * 커스텀 에러
     */

    // AUTH
    "4001": "WRONG_PASSWORD",
    "4002": "SAME_PASSWORD",
    "4003": "INVALID_REFRESH_TOKEN",

    // USER
    "4100": "USER_NOT_FOUND",
    "4101": "USER_EMAIL_DUPLICATED",
    "4102": "USER_NICKNAME_DUPLICATED",
    "4103": "USER_MOBILE_DUPLICATED",

    // PROFILE
    "4150": "PROFILE_NOT_FOUND",
} as const;
