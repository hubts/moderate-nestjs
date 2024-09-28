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
    // AUTH / USER
    DUPLICATE_EMAIL: {
        message: "This email already exists.",
        status: 400,
    },
    DUPLICATE_NICKNAME: {
        message: "This nickname already exists.",
        status: 400,
    },
    DUPLICATE_MOBILE: {
        message: "This mobile already exists.",
        status: 400,
    },
    WRONG_PASSWORD: {
        message: "This is wrong password.",
        status: 400,
    },
    SAME_PASSWORD: {
        message: "This password is same as before.",
        status: 400,
    },
    UNREGISTERED_EMAIL: {
        message: "This email is not registered.",
        status: 400,
    },
    USER_NOT_FOUND: {
        message: "The user does not exist.",
        status: 404,
    },
    INVALID_REFRESH_TOKEN: {
        message: "The refresh token is not valid.",
        status: 400,
    },
    UNAUTHORIZED_ACCESS: {
        message: "Unauthorized access. Please try in a different way.",
        status: 401,
    },
    PROFILE_NOT_FOUND: {
        message: "The profile does not exist.",
        status: 404,
    },

    // EXTERNAL
    UNEXPECTED_ERROR: {
        message: "Unexpected error occurs. Please contact us.",
        status: 403,
    },
    DATA_SOURCE_ERROR: {
        message: "Error occurs in data source. Please contact us.",
        status: 500,
    },
    EXTERNAL_SERVER_ERROR: {
        message: "Error occurs in external server. Please contact us.",
        status: 403,
    },
};
