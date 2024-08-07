import { CommonResponse } from "./interface/common-response.interface";

export interface UserApi<R> {
    getUserInfoById: (
        input: IUserIdParam
    ) => Promise<CommonResponse<IUserResource<IUserInfoResult>>>;
    getUserInfoByEmail: (
        input: IUserEmailParam
    ) => Promise<CommonResponse<IUserResource<IUserInfoResult>>>;
    getMyInfo: (
        requestor: R
    ) => Promise<CommonResponse<IUserResource<IMyUserInfoResult>>>;
}

export interface IUserIdParam {
    id: string;
}

export interface IUserEmailParam {
    email: string;
}

export interface IUserResource<R> {
    user: R;
}

export interface IUserInfoResult {
    id: string;
    joinedAt: Date;
    email: string;
    nickname: string;
}

export interface IMyUserInfoResult extends IUserInfoResult {
    mobile: string;
}
