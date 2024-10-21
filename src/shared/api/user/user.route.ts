import { ApiRoute } from "src/shared/type";
import { UserApi } from "./user.api";
import { UserModel, UserRole } from "./user.domain";

export const UserRoute: ApiRoute<UserApi<UserModel>, UserRole> = {
    apiTags: "User",
    pathPrefix: "users",
    getUserInfoById: {
        subRoute: "id/:id",
        roles: [],
        description: [
            "You can get the public information of user by ID.",
            "If the user ID does not exist, you will receive the failure message.",
        ],
    },
    getUserInfoByEmail: {
        subRoute: "email/:email",
        roles: [],
        description: [
            "You can get the public information of user by email.",
            "If the user email does not exist, you will receive the failure message.",
        ],
    },
    getMyInfo: {
        subRoute: "me",
        roles: ["USER"],
        description: ["You can get your own information by login information."],
    },
    updateMyInfo: {
        subRoute: "me",
        roles: ["USER"],
        description: [
            "You can update your own information by login information.",
        ],
    },
};
