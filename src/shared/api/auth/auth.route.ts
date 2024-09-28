import { ApiRoute } from "src/shared/type";
import { AuthApi } from "./auth.api";
import { UserRole } from "../user/user.domain";

export const AuthRoute: ApiRoute<AuthApi, UserRole> = {
    apiTags: "Authentication",
    pathPrefix: "auth",
    joinUser: {
        subRoute: "user/join",
        roles: [],
        description: [
            "Anyone can join as a new user.",
            "You must insert unique email, nickname, and mobile to join.",
            "The password you insert will be protected by 1-way encryption.",
            "See example schema of request body.",
            "If you are successfully joined, you can get new access and refresh tokens.",
        ],
    },
    loginUser: {
        subRoute: "user/login",
        roles: [],
        description: [
            "Anyone can login as the previously joined user.",
            "You must insert email and password to login.",
            "If you login successfully, you can get new access and refresh tokens.",
        ],
    },
    refreshUser: {
        subRoute: "user/refresh",
        roles: [],
        description: [
            "Anyone who has own refresh token and identity information can refresh to get new tokens.",
            "You must insert the refresh token recently issued and own identity information (such as ID).",
            "You will get new access and refresh tokens.",
        ],
    },
    deactivateUser: {
        subRoute: "user/deactivate",
        roles: [],
        description: [
            "This feature is only for test.",
            "Anyone can deactivate the user by soft-delete features.",
        ],
    },
};
