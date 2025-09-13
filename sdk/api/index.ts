import { AxiosInstance } from "axios";
import { createUserApi } from "./user/user.api";
import { UserRoute } from "./user";
import { createAuthApi } from "./auth/auth.api";
import { AuthRoute } from "./auth/auth.route";

export * from "./validation";
export * from "./auth";
export * from "./user";

export const createSdk = (client: AxiosInstance) => {
    return {
        auth: {
            api: createAuthApi(client),
            route: AuthRoute,
        },
        user: {
            api: createUserApi(client),
            route: UserRoute,
        },
    };
};
