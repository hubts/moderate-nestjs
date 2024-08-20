import { ApiRoute } from "./lib/api-route.type";
import { Role } from "../role/user.role";
import { UserApi } from "./user.api";

export const UserRoute: ApiRoute<UserApi<Role>, Role> = {
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
};
