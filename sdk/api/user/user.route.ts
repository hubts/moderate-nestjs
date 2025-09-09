import { RequestMethod } from "@nestjs/common";
import { ApiSetting } from "../../type";
import { UserSignature } from "./user.signature";
import { Enum } from "../../constant";

export const UserRoute: ApiSetting<UserSignature, Enum.UserRole> = {
    apiTags: "User",
    context: "users",

    getMyInfo: {
        method: RequestMethod.GET,
        path: "me",
        roles: ["USER"],
    },

    updateMyInfo: {
        method: RequestMethod.PATCH,
        path: "me",
        roles: ["USER"],
    },

    getUserInfoById: {
        method: RequestMethod.GET,
        path: "id/:id",
        roles: [],
    },

    getUserInfoByEmail: {
        method: RequestMethod.GET,
        path: "email/:email",
        roles: [],
    },
};
