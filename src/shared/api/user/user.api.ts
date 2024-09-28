import { CommonResponse } from "src/shared/type";
import { UserModel, UserProfileModel } from "./user.domain";

export interface UserApi<R> {
    getUserInfoById(params: UserIdParams): Promise<CommonResponse<UserInfo>>;
    getUserInfoByEmail(
        params: UserEmailParams
    ): Promise<CommonResponse<UserInfo>>;
    getMyInfo(requestor: R): Promise<CommonResponse<UserInfoWithProfile>>;
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
