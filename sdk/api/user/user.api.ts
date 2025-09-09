import { AxiosInstance } from "axios";
import { UserApi } from "./user.signature";
import { UserRoute } from "./user.route";
import { createApiWrapper } from "../../util";

export const createUserApi = (client: AxiosInstance): UserApi => {
    const api = createApiWrapper(client, UserRoute);

    return {
        getMyInfo: options => api.get("getMyInfo", options),
        updateMyInfo: (body, options) =>
            api.patch("updateMyInfo", body, options),
        getUserInfoById: (id, options) =>
            api.get("getUserInfoById", {
                ...options,
                pathParams: { id },
            }),
        getUserInfoByEmail: (email, options) =>
            api.get("getUserInfoByEmail", {
                ...options,
                pathParams: { email },
            }),
    };
};
