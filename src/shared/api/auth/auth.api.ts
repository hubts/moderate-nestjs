import { CommonResponse } from "src/shared/type";
import { UserModel, UserProfileModel } from "../user/user.domain";

export interface AuthApi {
    joinUser(input: UserJoin): Promise<CommonResponse<AuthToken>>;
    loginUser(input: UserLogin): Promise<CommonResponse<AuthToken>>;
    refreshUser(input: TokenRefresh): Promise<CommonResponse<AuthToken>>;
    deactivateUser(input: UserLogin): Promise<CommonResponse<null>>;
}

export type UserLogin = Pick<UserModel, "email"> & {
    password: string;
};

export type UserJoin = UserLogin &
    Pick<UserModel, "nickname"> &
    Pick<UserProfileModel, "name" | "mobile" | "address">;

export type TokenRefresh = {
    userId: string;
    refreshToken: string;
};

export interface AuthToken {
    accessToken: string;
    refreshToken: string;
}
