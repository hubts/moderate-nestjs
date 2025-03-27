import { ApiRoute } from "../../type";
import { UserApi } from "./user.api";
import { UserModel, UserRole } from "./user.domain";

export const UserRoute: ApiRoute<UserApi<UserModel>, UserRole> = {
    apiTags: "User",
    pathPrefix: "users",
    getUserInfoById: {
        method: "GET",
        subRoute: "id/:id",
        roles: [],
        description: [
            "You can get the public information of user by ID.",
            "If the user ID does not exist, you will receive the failure message.",
        ],
    },
    getUserInfoByEmail: {
        method: "GET",
        subRoute: "email/:email",
        roles: [],
        description: [
            "You can get the public information of user by email.",
            "If the user email does not exist, you will receive the failure message.",
        ],
    },
    getMyInfo: {
        method: "GET",
        subRoute: "me",
        roles: ["USER"],
        description: ["You can get your own information by login information."],
    },
    updateMyInfo: {
        method: "POST",
        subRoute: "me",
        roles: ["USER"],
        description: [
            "You can update your own information by login information.",
        ],
    },
};
