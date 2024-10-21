import { CommonResponse } from "src/shared/type";
import { UserModel, UserProfileModel } from "./user.domain";

export interface UserApi<R extends UserModel> {
    // Get user info by ID
    getUserInfoById(params: UserIdParams): Promise<CommonResponse<UserInfo>>;
    // Get user info by email
    getUserInfoByEmail(
        params: UserEmailParams
    ): Promise<CommonResponse<UserInfo>>;
    // Get my info
    getMyInfo(requestor: R): Promise<CommonResponse<UserInfoWithProfile>>;
    // Update my info
    updateMyInfo(
        requestor: R,
        input: UserUpdate
    ): Promise<CommonResponse<null>>;
}

export interface UserIdParams {
    id: string;
}

export interface UserEmailParams {
    email: string;
}

export type UserInfo = Pick<
    UserModel,
    "id" | "joinedAt" | "email" | "nickname" | "role"
>;

export type UserInfoWithProfile = UserInfo &
    Pick<UserProfileModel, "id" | "name" | "address" | "mobile">;

export type UserUpdate = Partial<
    Pick<UserModel, "nickname"> & Pick<UserProfileModel, "address" | "mobile">
>;
