import { CommonResponse } from "src/shared/type";
import { UserModel, UserProfileModel } from "../user/user.domain";

export interface AuthApi {
    // Join
    joinUser(input: UserJoin): Promise<CommonResponse<AuthToken>>;
    // Login
    loginUser(input: UserLogin): Promise<CommonResponse<AuthToken>>;
    // Refresh tokens
    refreshUser(input: TokenRefresh): Promise<CommonResponse<AuthToken>>;
    // Deactivate user
    deactivateUser(input: UserLogin): Promise<CommonResponse<null>>;
}

export type UserLogin = Pick<UserModel, "email"> & {
    password: string;
};

export type UserJoin = UserLogin &
    Pick<UserModel, "nickname"> &
    Pick<UserProfileModel, "name" | "mobile" | "address"> & {
        profileImage?: Express.Multer.File;
    };

export type TokenRefresh = {
    userId: string;
    refreshToken: string;
};

export interface AuthToken {
    accessToken: string;
    refreshToken: string;
}
