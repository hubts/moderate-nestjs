import { RequestMethod } from "@nestjs/common";
import { ApiSetting } from "../../type";
import { AuthSignature } from "./auth.signature";

export const AuthRoute: ApiSetting<AuthSignature> = {
    apiTags: "Authentication",
    context: "auth",

    joinUser: {
        method: RequestMethod.POST,
        path: "user/join",
        roles: [],
    },

    loginUser: {
        method: RequestMethod.POST,
        path: "user/login",
        roles: [],
    },

    refreshUser: {
        method: RequestMethod.POST,
        path: "user/refresh",
        roles: [],
    },

    deactivateUser: {
        method: RequestMethod.POST,
        path: "user/deactivate",
        roles: [],
    },
};
