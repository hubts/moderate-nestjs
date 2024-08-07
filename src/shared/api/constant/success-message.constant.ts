/**
 * @description
 * API 응답 성공 메시지를 설정합니다.
 * 성공 응답은 공통 응답 코드인 1000 하위에서 메시지 및 데이터를 다르게 설정합니다.
 */
export const SUCCESS_MESSAGE = {
    DEFAULT: "Success",
    AUTH: {
        JOIN_USER: "Welcome! You can login now.",
        LOGIN_USER: "Login successfully completed.",
        USER_DEACTIVATED: "The user is deactivated.",
    },
    USER: {
        FOUND: "The user is found successfully.",
    },
};
