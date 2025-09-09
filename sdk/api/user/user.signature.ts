import { UserInfo } from "os";
import {
    CommonResponse,
    ForBackendInterface,
    ForFrontendApi,
} from "../../type";
import {
    UserEmail,
    UserPrivateInfo,
    UserPublicInfo,
    UserUpdate,
} from "./user.interface";

export interface UserSignature {
    // 나의 정보 조회
    getMyInfo(): Promise<CommonResponse<UserPrivateInfo>>;

    // 나의 정보 업데이트
    updateMyInfo(input: UserUpdate): Promise<CommonResponse>;

    // 유저 정보 조회 by ID
    getUserInfoById(id: string): Promise<CommonResponse<UserPublicInfo>>;

    // 유저 정보 조회 by 이메일
    getUserInfoByEmail(
        input: UserEmail
    ): Promise<CommonResponse<UserPublicInfo>>;
}

export type UserInterface = ForBackendInterface<UserSignature>;
export type UserApi = ForFrontendApi<UserSignature>;
