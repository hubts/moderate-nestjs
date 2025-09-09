import { AxiosInstance } from "axios";
import { createApiWrapper } from "../../util";
import { AuthRoute } from "./auth.route";
import { AuthApi } from "./auth.signature";

export const createAuthApi = (client: AxiosInstance): AuthApi => {
    const api = createApiWrapper(client, AuthRoute);

    return {
        joinUser: input => api.post("joinUser", input),
        loginUser: input => api.post("loginUser", input),
        refreshUser: input => api.post("refreshUser", input),
        deactivateUser: input => api.post("deactivateUser", input),
    };
};
