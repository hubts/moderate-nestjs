import { ErrorName } from "../type";

/**
 * @description
 * 에러 이름에 따른 에러 응답 정의
 */
export const ERROR: {
    [key in ErrorName]: {
        message: string;
        status: number;
        description?: string | string[];
    };
} = {
    BAD_REQUEST: {
        message: "Bad request. Please check your request.",
        status: 400,
    },
    UNAUTHORIZED: {
        message: "Unauthorized access. You need to login first.",
        status: 401,
    },
    FORBIDDEN_RESOURCE: {
        message: "You do not have permission to access this resource.",
        status: 403,
    },
    PAYLOAD_TOO_LARGE: {
        message:
            "The payload size is too large. Check your request or file size.",
        status: 413,
    },
    INTERNAL_SERVER_ERROR: {
        message: "Internal server error occurs. Please contact us.",
        status: 500,
    },
    NOT_IMPLEMENTED: {
        message: "This feature is not implemented yet.",
        status: 501,
    },
    SERVICE_UNAVAILABLE: {
        message: "Service is unavailable. Please try again later.",
        status: 503,
    },

    // AUTH
    WRONG_PASSWORD: {
        message: "You entered the wrong password. Please try again.",
        status: 400,
    },
    SAME_PASSWORD: {
        message: "You cannot change it to the same password.",
        status: 400,
    },
    INVALID_REFRESH_TOKEN: {
        message: "Your refresh token is not valid.",
        status: 400,
    },

    // USER
    USER_NOT_FOUND: {
        message: "The user does not exist.",
        status: 404,
    },
    USER_EMAIL_DUPLICATED: {
        message: "This email already exists.",
        status: 400,
    },
    USER_NICKNAME_DUPLICATED: {
        message: "This nickname already exists.",
        status: 400,
    },
    USER_MOBILE_DUPLICATED: {
        message: "This mobile already exists.",
        status: 400,
    },

    // PROFILE
    PROFILE_NOT_FOUND: {
        message: "The profile does not exist.",
        status: 404,
    },
};
