import { CommonResponse } from "./interface/common-response.interface";

export interface AuthApi {
    joinUser: (
        input: IUserJoinDto
    ) => Promise<CommonResponse<IAuthTokenResult>>;
    loginUser: (
        input: IUserLoginDto
    ) => Promise<CommonResponse<IAuthTokenResult>>;
    refreshUser: (
        input: IUserRefreshDto
    ) => Promise<CommonResponse<IAuthTokenResult>>;
    deactivateUser: (input: IUserLoginDto) => Promise<CommonResponse<null>>;
}

export interface IUserLoginDto {
    email: string;
    password: string;
}

export interface IUserJoinDto extends IUserLoginDto {
    nickname: string;
    mobile: string;
}

export interface IUserRefreshDto {
    refreshToken: string;
    id: string;
}

export interface IAuthTokenResult {
    accessToken: string;
    refreshToken: string;
}
